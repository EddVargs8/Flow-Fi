// Crear cancion page
"use client";

import { useEffect, useRef } from 'react';

export default function Page() {
    const canvasRef = useRef(null); 

    useEffect(() => { 
        const drums_rnn = new mm.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/drum_kit_rnn');
        const melodyRNN = new mm.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/chord_pitches_improv');
        const bassRNN = new mm.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/chord_pitches_improv');

        drums_rnn.initialize();
        melodyRNN.initialize();
        bassRNN.initialize();

        const playBtn = document.getElementById('playBtn');
        const recordBtn = document.getElementById('recordBtn');
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = 400;  // Ajusta según tus necesidades
        canvas.height = 200; // Ajusta según tus necesidades
        let animationFrameId;

        const qpm = 70;  
        const secondsPerStep = 60 / (qpm * 4);  
        const steps = 48;
        const temperature = 1.5;
        let songDuration = 0; 

        function planificarSecuencia(instrument, sequence, secondsPerStep) {
            const part = new Tone.Part((time, note) => {
                instrument.triggerAttackRelease(
                    Tone.Frequency(note.pitch, "midi").toNote(),
                    (note.quantizedEndStep - note.quantizedStartStep) * secondsPerStep,
                    time
                );
            }, sequence.notes.map(note => ({
                time: note.quantizedStartStep * secondsPerStep,
                pitch: note.pitch,
                quantizedEndStep: note.quantizedEndStep,
                quantizedStartStep: note.quantizedStartStep
            })));
            part.start(0); // Todas las partes se iniciarán en el tiempo 0
            return part;
        }
        

        let mediaRecorder;
        let audioChunks = [];
        
        const startRecording = async () => {
            await Tone.loaded();
            await Tone.start();
            const destination = Tone.Destination.context.createMediaStreamDestination();
            Tone.Destination.connect(destination);
            mediaRecorder = new MediaRecorder(destination.stream);
            mediaRecorder.start();

            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                const downloadLink = document.createElement('a');
                downloadLink.href = audioUrl;
                const uniqueId = Date.now();
                downloadLink.download = `generated_song_${uniqueId}.wav`;
                downloadLink.style.display = 'none';
                document.body.appendChild(downloadLink);    
                downloadLink.click();
                document.body.removeChild(downloadLink);
                audioChunks = []; // Limpiar los datos de audio después de la descarga
            };

            Tone.Transport.scheduleOnce(() => {
                Tone.Transport.stop();
            }, `+${songDuration}`);
            Tone.Transport.start(); 
        }

        const synth = new Tone.Sampler({
            urls: {
                "A0": "A0.ogg",
                "A1": "A1.ogg",
                "A2": "A2.ogg",
                "A3": "A3.ogg",
                "A4": "A4.ogg",
                "A5": "A5.ogg",
                "A6": "A6.ogg",
                "A7": "A7.ogg",
                "C1": "C1.ogg",
                "C2": "C2.ogg",
                "C3": "C3.ogg",
                "C4": "C4.ogg",
                "C5": "C5.ogg",
                "C6": "C6.ogg",
                "C7": "C7.ogg",
                "C8": "C8.ogg",
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
                "F#7": "Fs7.ogg"  
            },
            baseUrl: "/sounds/salamander/", 
            onload: () => {
                console.log("Piano samples loaded!");
            }
        }).toDestination();

        const drumKit = new Tone.Sampler({
            urls: {
                "C1": "kick.mp3",        // Bombo
                "D1": "snare.mp3",       // Caja
                "E1": "hihat-closed.mp3",// Hi-hat cerrado
                "F1": "hihat-open.mp3",  // Hi-hat abierto
                "G1": "clap.mp3",        // Aplauso
                "A1": "tom-low.mp3",     // Tom bajo
                "B1": "tom-mid.mp3",     // Tom medio
                "C2": "tom-high.mp3",    // Tom alto
                "D2": "ride.mp3"         // Platillo ride
            },
            baseUrl: "/sounds/drums/", 
            onload: () => {
                console.log("Kit de batería cargado");
            }
        }).toDestination();

        const bassSynth = new Tone.Sampler({
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
              "E2": "E2.ogg",
              "E3": "E3.ogg",
              "E4": "E4.ogg",
              "E5": "E5.ogg",
              "G2": "G2.ogg",
              "G3": "G3.ogg",
              "G4": "G4.ogg",
              "G5": "G5.ogg"
            },
            baseUrl: "/sounds/bass/", // Ruta base a los archivos de samples
            onload: () => {
                console.log("Bass samples loaded!");
            }
          }).toDestination();

        // Crear un Analyser y conectarlo al destino de audio
        const analyser = new Tone.Analyser('fft', 256); // Puedes ajustar 'fft' o 'waveform' y el tamaño
        Tone.Destination.connect(analyser);

        Tone.Transport.on("stop", () => {
            if (mediaRecorder && mediaRecorder.state === 'recording') mediaRecorder.stop();
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        });


        function drawVisualizer() {
            // Solicita el siguiente frame de animación
            animationFrameId = requestAnimationFrame(drawVisualizer);
        
            // Obtener los datos de frecuencia del Analyser
            const bufferLength = analyser.size;
            const dataArray = analyser.getValue();
        
            // Limpiar el canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        
            // Configurar parámetros de dibujo
            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;
        
            // Recorrer los datos y dibujar las barras
            for (let i = 0; i < bufferLength; i++) {
                barHeight = (dataArray[i] + 140) * 2;
        
                ctx.fillStyle = `rgb(${Math.floor(barHeight + 100)}, 50, 50)`;
                ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
        
                x += barWidth + 1;
            }
        }
        
        const playSong = async () => {
            await Tone.loaded(); 
            try {
                await Tone.start();

                const chordProgression = ['Am7', 'D9', 'Gmaj7', 'Cmaj7'];
                const pianoSequence = await melodyRNN.continueSequence(
                    {
                        "quantizationInfo": {"stepsPerQuarter": 4},
                        "notes": [
                            {"pitch": 60, "quantizedStartStep": 0, "quantizedEndStep": 4},  // C4
                            {"pitch": 64, "quantizedStartStep": 4, "quantizedEndStep": 8},  // E4
                            {"pitch": 67, "quantizedStartStep": 8, "quantizedEndStep": 12}, // G4
                            {"pitch": 62, "quantizedStartStep": 12, "quantizedEndStep": 16} // D4
                        ],
                        "totalTime": 4.0,
                        "totalQuantizedSteps": 16,
                        "tempos": [{"time": 0, "qpm": 80}]
                      }
                                            
                    ,steps, temperature, chordProgression);
                console.log('pianoSequence:', pianoSequence);
                const drumsSequence = await drums_rnn.continueSequence(
                    {
                        "quantizationInfo": {"stepsPerQuarter": 4},
                        "notes": [
                          {"pitch": 36, "startTime": 0.0, "endTime": 0.5, "quantizedStartStep": 0, "quantizedEndStep": 2},   // Kick
                          {"pitch": 42, "startTime": 0.5, "endTime": 1.0, "quantizedStartStep": 2, "quantizedEndStep": 4},   // Hi-hat
                          {"pitch": 38, "startTime": 1.0, "endTime": 1.5, "quantizedStartStep": 4, "quantizedEndStep": 6},   // Snare
                          {"pitch": 42, "startTime": 1.5, "endTime": 2.0, "quantizedStartStep": 6, "quantizedEndStep": 8},   // Hi-hat
                          {"pitch": 36, "startTime": 2.0, "endTime": 2.5, "quantizedStartStep": 8, "quantizedEndStep": 10},  // Kick
                          {"pitch": 42, "startTime": 2.5, "endTime": 3.0, "quantizedStartStep": 10, "quantizedEndStep": 12}, // Hi-hat
                          {"pitch": 38, "startTime": 3.0, "endTime": 3.5, "quantizedStartStep": 12, "quantizedEndStep": 14}, // Snare
                          {"pitch": 42, "startTime": 3.5, "endTime": 4.0, "quantizedStartStep": 14, "quantizedEndStep": 16}  // Hi-hat
                        ],
                        "totalTime": 4.0,
                        "totalQuantizedSteps": 16,
                        "tempos": [{"time": 0, "qpm": 80}]
                      }      
                    , steps, temperature);
                console.log('drumsSequence:', drumsSequence);
                const bassSequence = await bassRNN.continueSequence(
                    {
                        "quantizationInfo": {"stepsPerQuarter": 4},
                        "notes": [
                            {"pitch": 50, "quantizedStartStep": 0, "quantizedEndStep": 4},  // C3
                            {"pitch": 52, "quantizedStartStep": 4, "quantizedEndStep": 8},  // E3
                            {"pitch": 53, "quantizedStartStep": 8, "quantizedEndStep": 12}, // A2
                            {"pitch": 55, "quantizedStartStep": 12, "quantizedEndStep": 16} // G2
                        ],
                        "totalTime": 4.0,
                        "totalQuantizedSteps": 16,
                        "tempos": [{"time": 0, "qpm": 80}]
                      }
                      
                    , steps, temperature, chordProgression);
                console.log('bassSequence:', bassSequence);

                if (Tone.Transport.parts) {
                    Tone.Transport.parts.forEach(part => part.dispose());
                    Tone.Transport.parts = [];
                }

                const drumPart = planificarSecuencia(drumKit, drumsSequence, secondsPerStep);
                const pianoPart = planificarSecuencia(synth, pianoSequence, secondsPerStep);
                const bassPart = planificarSecuencia(bassSynth, bassSequence, secondsPerStep);
                Tone.Transport.parts = [drumPart, pianoPart, bassPart];
                Tone.Transport.bpm.value = 60;
                // Calcular la duración total de la canción en segundos
                const totalSteps = drumsSequence.totalQuantizedSteps; // Todas las secuencias tienen los mismos pasos
                songDuration = totalSteps * secondsPerStep;

                Tone.Transport.scheduleOnce(() => {
                    Tone.Transport.stop();
                }, `+${songDuration}`);
                drawVisualizer();
                Tone.Transport.start();
            } catch (error) {
                console.error('Error en playSong:', error);
            }
        };
        

        if (playBtn) 
            playBtn.addEventListener('click', playSong);
        if (recordBtn) 
            recordBtn.addEventListener('click', startRecording);
        // Limpieza para evitar duplicados
        return () => {
            if (playBtn)
                playBtn.removeEventListener('click', playSong);
            if (recordBtn)
                recordBtn.removeEventListener('click', startRecording);
            Tone.Transport.stop();
            Tone.Transport.cancel();
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };


    }, []);

    return (
        <div className='block text-center'>

            <div className="flex flex-col p-4">
            
            <div className="flex items-center w-full max-w-md my-2">
                <div className="ml-2">
                <canvas ref={canvasRef} className="bg-gray-200 rounded-md h-32 w-64"></canvas>
                </div>
            </div>
        
            
            <script src="https://cdn.jsdelivr.net/npm/@magenta/music@^1.23.1"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.39/Tone.min.js"></script>
            </div>

            <button id='playBtn' className="mt-6 bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600"> Generar canción </button>
            <button id='recordBtn' className="mt-6 bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600"> Grabar canción </button>
        
        </div>
        
      );
      
}
