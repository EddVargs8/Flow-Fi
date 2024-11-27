// Crear cancion page
"use client";

import { useEffect, useRef, useState } from "react";
import { pianoSeeds, bassSeeds, drumsSeeds } from "../MIDI conversion/seeds";
import { useSession } from "next-auth/react";

export default function Page() {
  const { data: session } = useSession();
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [loadingSequences, setLoadingSequences] = useState(false);

  useEffect(() => {
    let synth = null;
    let drumKit = null;
    let bassSynth = null;
    let drums_rnn = null;
    let melodyRNN = null;
    let bassRNN = null;
    let rainSound = null;

    const loadModels = async () => {
      drums_rnn = new mm.MusicRNN(
        "https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/drum_kit_rnn"
      );
      melodyRNN = new mm.MusicRNN(
        "https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/chord_pitches_improv"
      );
      bassRNN = new mm.MusicRNN(
        "https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/chord_pitches_improv"
      );

      synth = new Tone.Sampler({
        urls: {
          A0: "A0.ogg",
          A1: "A1.ogg",
          A2: "A2.ogg",
          A3: "A3.ogg",
          A4: "A4.ogg",
          A5: "A5.ogg",
          A6: "A6.ogg",
          A7: "A7.ogg",
          C1: "C1.ogg",
          C2: "C2.ogg",
          C3: "C3.ogg",
          C4: "C4.ogg",
          C5: "C5.ogg",
          C6: "C6.ogg",
          C7: "C7.ogg",
          C8: "C8.ogg",
          "D#1": "Ds1.ogg",
          "D#2": "Ds2.ogg",
          "D#3": "Ds3.ogg",
          "D#4": "Ds4.ogg",
          "D#5": "Ds5.ogg",
          "D#6": "Ds6.ogg",
          "D#7": "Ds7.ogg",
          "F#1": "Fs1.ogg",
          "F#2": "Fs2.ogg",
          "F#3": "Fs3.ogg",
          "F#4": "Fs4.ogg",
          "F#5": "Fs5.ogg",
          "F#6": "Fs6.ogg",
          "F#7": "Fs7.ogg",
        },
        baseUrl: "/sounds/salamander/",
        onload: () => {
          console.log("Piano samples loaded!");
        },
      }).toDestination();

      drumKit = new Tone.Sampler({
        urls: {
          C1: "kick.mp3", // Bombo
          D1: "snare.mp3", // Caja
          E1: "hihat-closed.mp3", // Hi-hat cerrado
          F1: "hihat-open.mp3", // Hi-hat abierto
          G1: "clap.mp3", // Aplauso
          A1: "tom-low.mp3", // Tom bajo
          B1: "tom-mid.mp3", // Tom medio
          C2: "tom-high.mp3", // Tom alto
          D2: "ride.mp3", // Platillo ride
        },
        baseUrl: "/sounds/drums/",
        onload: () => {
          console.log("Kit de batería cargado");
        },
      }).toDestination();

      bassSynth = new Tone.Sampler({
        urls: {
          "A#2": "As2.ogg",
          "A#3": "As3.ogg",
          "A#4": "As4.ogg",
          "A#5": "As5.ogg",
          "C#2": "Cs2.ogg",
          "C#3": "Cs3.ogg",
          "C#4": "Cs4.ogg",
          "C#5": "Cs5.ogg",
          "C#6": "Cs6.ogg",
          E2: "E2.ogg",
          E3: "E3.ogg",
          E4: "E4.ogg",
          E5: "E5.ogg",
          G2: "G2.ogg",
          G3: "G3.ogg",
          G4: "G4.ogg",
          G5: "G5.ogg",
        },
        baseUrl: "/sounds/bass/", // Ruta base a los archivos de samples
        onload: () => {
          console.log("Bass samples loaded!");
        },
      }).toDestination();

      rainSound = new Tone.Player({
        url: "/sounds/fx/rain.mp3", // Ruta del sonido de lluvia
        loop: true, // Repetir sonido mientras la canción esté activa
        autostart: false, // No empezar automáticamente
        volume: -6, // Nivel inicial de volumen (ajústalo según prefieras)
      }).toDestination();

      await Promise.all([
        drums_rnn.initialize(),
        melodyRNN.initialize(),
        bassRNN.initialize(),
        Tone.loaded(),
      ]);

      setLoading(false); // Modelos cargados
    };

    loadModels();
    const playBtn = document.getElementById("playBtn");
    const recordBtn = document.getElementById("recordBtn");
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let duration;
    let steps;
    let qpm = 65;
    let temperature;
    let animationFrameId;
    const secondsPerStep = 60 / (qpm * 4);

    function planificarSecuencia(instrument, sequence, secondsPerStep) {
      const part = new Tone.Part(
        (time, note) => {
          instrument.triggerAttackRelease(
            Tone.Frequency(note.pitch, "midi").toNote(),
            (note.quantizedEndStep - note.quantizedStartStep) * secondsPerStep,
            time
          );
        },
        sequence.notes.map((note) => ({
          time: note.quantizedStartStep * secondsPerStep,
          pitch: note.pitch,
          quantizedEndStep: note.quantizedEndStep,
          quantizedStartStep: note.quantizedStartStep,
        }))
      );
      part.start(0); // Todas las partes se iniciarán en el tiempo 0
      return part;
    }

    let mediaRecorder;
    let audioChunks = [];

    const startRecording = async () => {
      await Tone.loaded();
      await Tone.start();
      const destination =
        Tone.Destination.context.createMediaStreamDestination();
      Tone.Destination.connect(destination);
      mediaRecorder = new MediaRecorder(destination.stream);
      mediaRecorder.start();

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);
        const downloadLink = document.createElement("a");
        downloadLink.href = audioUrl;
        const uniqueId = Date.now();
        downloadLink.download = `generated_song_${uniqueId}.wav`;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        audioChunks = []; // Limpiar los datos de audio después de la descarga
      };

      Tone.Transport.scheduleOnce(() => {
        Tone.Transport.stop();
      }, `+${duration}`);
      drawVisualizer();
      Tone.Transport.start();
    };

    const analyser = new Tone.Analyser("fft", 256);
    Tone.Destination.connect(analyser);

    Tone.Transport.on("stop", () => {
      if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
     }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (rainSound) {
        rainSound.stop(); // Detén la lluvia si está activa
      }
    });

    function drawVisualizer() {
      animationFrameId = requestAnimationFrame(drawVisualizer);
      const bufferLength = analyser.size;
      const dataArray = analyser.getValue();

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] + 140) * 2;

        ctx.fillStyle = `rgb(${Math.floor(barHeight / 2 + 2)}, ${Math.floor(
          barHeight / 4 + 60
        )}, ${Math.floor(barHeight / 4 + 60)})`;
        ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);

        x += barWidth + 1;
      }
    }

    const getRandomSeed = (seeds) => seeds[Math.floor(Math.random() * seeds.length)];

    const playSong = async () => {
      setLoadingSequences(true); 
      try {
        await Tone.start();

        temperature = parseFloat(
          document.getElementById("temperatureSlider").value
        );
        duration = parseInt(
          document.getElementById("durationDropdown").value,
          10
        );
        steps = Math.floor(duration / secondsPerStep);
        const chordProgression = ["Dm7", "G7", "Cmaj7", "Am7"];

        const pianoSeed = getRandomSeed(pianoSeeds);
        const bassSeed = getRandomSeed(bassSeeds);
        const drumsSeed = getRandomSeed(drumsSeeds);
        const [pianoSequence, drumsSequence, bassSequence] = await Promise.all([
          melodyRNN.continueSequence(
            pianoSeed,
            steps,
            temperature,
            chordProgression
          ),
          drums_rnn.continueSequence(
            drumsSeed,
            steps,
            temperature
          ),
          bassRNN.continueSequence(
            bassSeed,
            steps,
            temperature,
            chordProgression
          ),
        ]);
        setLoadingSequences(false); // Ocultar loader del canvas

        pianoSequence.tempos = [{ qpm: qpm }];
        drumsSequence.tempos = [{ qpm: qpm }];
        bassSequence.tempos = [{ qpm: qpm }];
        if (Tone.Transport.parts) {
          Tone.Transport.parts.forEach((part) => part.dispose());
          Tone.Transport.parts = [];
        }
        const drumPart = planificarSecuencia(
          drumKit,
          drumsSequence,
          secondsPerStep
        );
        const pianoPart = planificarSecuencia(
          synth,
          pianoSequence,
          secondsPerStep
        );
        const bassPart = planificarSecuencia(
          bassSynth,
          bassSequence,
          secondsPerStep
        );
        Tone.Transport.parts = [drumPart, pianoPart, bassPart];
        Tone.Transport.bpm.value = qpm;
        if (rainSound) {
            rainSound.start();
        }

        Tone.Transport.scheduleOnce(() => {
          Tone.Transport.stop();
          if (rainSound) {
            rainSound.stop(); // Detén la lluvia al finalizar
          }
        }, `+${duration}`);
        drawVisualizer();
        Tone.Transport.start();
      } catch (error) {
        console.error("Error en playSong:", error);
        setLoadingSequences(false);
      }
    };

    if (playBtn) playBtn.addEventListener("click", playSong);
    if (recordBtn) recordBtn.addEventListener("click", startRecording);
  }, []);

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col items-center justify-center space-y-4">
          <l-metronome size="300" speed="1.6" color="#023C3C"></l-metronome>
          <p className="text-white text-lg font-medium">
            Inicializando modelos de Magenta...
          </p>
        </div>
      )}

      <div className="bg-gradient-to-b from-[#023C3C4D] via-[#027F7F33] to-white min-h-screen">
        <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
          <div className="flex w-full max-w-4xl p-4 bg-white rounded-lg shadow-md">
            <div className="w-1/3 flex flex-col items-start p-4 border-r">
              <h2 className="text-lg font-semibold mb-4">Controles</h2>

              {/* Control: Temperatura */}
              <label
                className="text-sm font-medium mb-1"
                htmlFor="temperatureSlider"
              >
                Temperatura (0.8 - 1.5)
              </label>
              <input
                id="temperatureSlider"
                type="range"
                min="0.8"
                max="1.5"
                step="0.1"
                defaultValue="1"
                className="w-full mb-4"
              />

              {/* Control: Duración */}
              <label
                className="text-sm font-medium mb-1"
                htmlFor="durationDropdown"
              >
                Duración de la Canción
              </label>
              <select
                id="durationDropdown"
                className="w-full p-2 border rounded mb-4"
              >
                <option value="15">15 segundos</option>
                <option value="30">30 segundos</option>
                <option value="60">1 minuto</option>
                <option value="90">1 minuto 30 segundos</option>
                <option value="120">2 minutos</option>
                <option value="180">3 minutos</option>
              </select>
              {/* Botones (parte inferior) */}
              <div className="flex justify-center mt-6 space-x-4">
                <button
                  id="playBtn"
                  className="rounded-md bg-gradient-to-r from-[#02514E] to-[#027F7F] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gradient-to-br"
                >
                  {" "}
                  Generar canción{" "}
                </button>
                


                {session ? (
              <button
              id="recordBtn"
              className="rounded-md bg-gradient-to-r from-[#02514E] to-[#027F7F] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gradient-to-br"
            >
              {" "}
              Grabar canción{" "}
            </button>
            ) : (
              <p> </p>
            )}


                
              </div>
            </div>

            <div className="w-2/3 flex flex-col items-center p-4 relative">
              <h2 className="text-lg font-semibold mb-4">Visualizador</h2>
              <canvas
                ref={canvasRef}
                className="bg-gray-200 rounded-md w-full h-64"
              ></canvas>
              {loadingSequences && (
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                  <l-waveform
                    size="50"
                    stroke="3.5"
                    speed="1"
                    color="#023C3C"
                  ></l-waveform>
                  <p className="text-gray-800 font-medium mt-4 ml-4">
                    Generando canción...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/@magenta/music@^1.23.1"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.39/Tone.min.js"></script>
        <script
          type="module"
          src="https://cdn.jsdelivr.net/npm/ldrs/dist/auto/metronome.js"
        ></script>
        <script
          type="module"
          src="https://cdn.jsdelivr.net/npm/ldrs/dist/auto/waveform.js"
        ></script>
      </div>
    </>
  );
}
