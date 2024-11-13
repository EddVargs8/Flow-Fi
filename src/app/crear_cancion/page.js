// Crear cancion page
"use client";

import { useEffect } from 'react';
import { getRandomNoteSequence } from '../MIDI conversion/conversion';


export default function Page() {
    useEffect(() => { 
        const drums_rnn = new mm.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/drum_kit_rnn');
        const melodyRNN = new mm.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/chord_pitches_improv');
        const bassRNN = new mm.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/chord_pitches_improv');

        drums_rnn.initialize();
        melodyRNN.initialize();
        bassRNN.initialize();

        let viz = null;
        const playBtn = document.getElementById('playBtn');
        const drumsViz = document.getElementById('drumsCanvas');
        const pianoViz = document.getElementById('pianoCanvas');
        const bassViz = document.getElementById('bassCanvas');
        const qpm = 80;  
        const secondsPerStep = 60 / (qpm * 4);  
        const steps = 64;
        const temperature = 1;
        
        function setupVisualizer(sequence, canvas) {
            const config = {
                noteHeight: 10,
                pixelsPerTimeStep: 200,  // like a note width
                noteSpacing: 2,
                noteRGB: '194, 24, 7',
                activeNoteRGB: '87, 35, 100',
            };
    
            viz = new mm.PianoRollCanvasVisualizer(sequence, canvas, config);
        }


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

        async function getQuantizedNote() {
            const randomSeed = await getRandomNoteSequence();
            if (!randomSeed) {
                console.error("No se pudo cargar el NoteSequence.");
                 return;
            }
            const quantizedSequence = mm.sequences.quantizeNoteSequence(randomSeed, 4);
            quantizedSequence.totalQuantizedSteps = quantizedSequence.totalQuantizedSteps || quantizedSequence.notes[quantizedSequence.notes.length - 1].quantizedEndStep;
            quantizedSequence.tempos = [{ time: 0, qpm: 90 }];
            const minPitch = 60;  // C4
            const maxPitch = 72;  // C5
            quantizedSequence.notes.forEach(note => {
                // Ajusta el pitch de cada nota al rango deseado
                if (note.pitch < minPitch) {
                    note.pitch = minPitch; 
                } else if (note.pitch > maxPitch) {
                    note.pitch = maxPitch;  
                }
            });
            return quantizedSequence;
        }

        const playSong = async () => {
            await Tone.loaded(); 
            try {
                Tone.Transport.stop();
                Tone.Transport.cancel();
                await Tone.start();

                //const quantizedSequence = await getQuantizedNote();
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
                //setupVisualizer(pianoSequence, pianoViz);
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
                //setupVisualizer(drumsSequence, drumsViz);
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
                //setupVisualizer(bassSequence, bassViz);
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
                Tone.Transport.start();
            } catch (error) {
                console.error('Error en playSong:', error);
            }
        };
        

        if (playBtn) 
            playBtn.addEventListener('click', playSong);

        // Limpieza para evitar duplicados
        return () => {
            if (playBtn)
                playBtn.removeEventListener('click', playSong);
            Tone.Transport.stop();
            Tone.Transport.cancel();
        };


    }, []);

    return (
        <div className='block text-center'>

            <div className="flex flex-col p-4">
            {/* Fila para Drums */}
            <div className="flex items-center w-full max-w-md my-2">
                <span className="text-green-600 font-semibold w-20">Drums</span>
                <div className="ml-2">
                <canvas id="drumsCanvas" className="bg-gray-200 rounded-md h-32 w-64"></canvas>
                </div>
            </div>
        
            {/* Fila para Piano */}
            <div className="flex items-center w-full max-w-md my-2">
                <span className="text-green-600 font-semibold w-20">Piano</span>
                <div className="ml-2">
                <canvas id="pianoCanvas" className="bg-gray-200 rounded-md h-32 w-64"></canvas>
                </div>
            </div>
        
            {/* Fila para Bass */}
            <div className="flex items-center w-full max-w-md my-2">
                <span className="text-green-600 font-semibold w-20">Bass</span>
                <div className="ml-2">
                <canvas id="bassCanvas" className="bg-gray-200 rounded-md h-32 w-64"></canvas>
                </div>
            </div>
        
            
            
            <script src="https://cdn.jsdelivr.net/npm/@magenta/music@^1.23.1"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.39/Tone.min.js"></script>
            </div>

            <button id='playBtn' className="mt-6 bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600"> Generar canción </button>
        
        </div>
        
      );
      
}
