// Crear cancion page
"use client";

import { useEffect } from 'react';

export default function Page() {
    useEffect(() => {
        const MELODY = {
            notes: [
                { pitch: 64, quantizedStartStep: 0, quantizedEndStep: 1 },  // E
                { pitch: 64, quantizedStartStep: 1, quantizedEndStep: 2 },  // E
                { pitch: 65, quantizedStartStep: 2, quantizedEndStep: 3 },  // F
                { pitch: 67, quantizedStartStep: 3, quantizedEndStep: 4 },  // G
                { pitch: 67, quantizedStartStep: 4, quantizedEndStep: 5 },  // G
                { pitch: 65, quantizedStartStep: 5, quantizedEndStep: 6 },  // F
                { pitch: 64, quantizedStartStep: 6, quantizedEndStep: 7 },  // E
                { pitch: 62, quantizedStartStep: 7, quantizedEndStep: 8 },  // D
                { pitch: 60, quantizedStartStep: 8, quantizedEndStep: 9 },  // C
                { pitch: 60, quantizedStartStep: 9, quantizedEndStep: 10 }, // C
                { pitch: 62, quantizedStartStep: 10, quantizedEndStep: 11 }, // D
                { pitch: 64, quantizedStartStep: 11, quantizedEndStep: 12 }, // E
                { pitch: 64, quantizedStartStep: 12, quantizedEndStep: 13 }, // E
                { pitch: 62, quantizedStartStep: 13, quantizedEndStep: 14 }, // D
                { pitch: 62, quantizedStartStep: 14, quantizedEndStep: 15 }, // D
            ],
            quantizationInfo: { stepsPerQuarter: 4 },
            tempos: [{ time: 0, qpm: 110 }],
            totalQuantizedSteps: 15,
        };

        const config = {
            noteHeight: 10,
            pixelsPerTimeStep: 200,  // like a note width
            noteSpacing: 2,
            noteRGB: '194, 24, 7',
            activeNoteRGB: '87, 35, 100',
        };

        let viz = new mm.PianoRollCanvasVisualizer(MELODY, document.getElementById('canvas'), config);

        const music_rnn = new mm.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/basic_rnn');
        music_rnn.initialize();

        const rnnPlayer = new mm.Player(false, {
            run: (note) => {
                console.log(note); 
                viz.redraw(note); // Actualiza la visualización de la nota activa
            },
            stop: () => {
                console.log('Reproducción terminada');
            },
        });

        const button = document.getElementById('button');

        const handleClick = () => {
            
            if (mm.Player.tone.state === 'started') {
                console.log('La secuencia ya está en reproducción. Deteniendo...');
                rnnPlayer.stop().then(() => {
                    mm.Player.tone.stop(); // Detenemos el tono también
                    console.log('Secuencia detenida.');
                });
                return; // Salimos para no iniciar de nuevo
            }

            // Iniciar AudioContext
            mm.Player.tone.start().then(() => {
                console.log('AudioContext iniciado');
                music_rnn.continueSequence(MELODY, 25, 3)
                    .then((sample) => {
                        console.log('Iniciando nueva secuencia.');

                        const offset = MELODY.totalQuantizedSteps;
                            sample.notes.forEach(note => {
                            note.quantizedStartStep += offset;
                            note.quantizedEndStep += offset;
                        });

                        const combinedSequence = {
                            ...MELODY,
                            notes: [...MELODY.notes, ...sample.notes], // Concatenar las notas originales con las nuevas
                            totalQuantizedSteps: MELODY.totalQuantizedSteps + sample.totalQuantizedSteps,
                        };
                        viz = new mm.PianoRollCanvasVisualizer(combinedSequence, document.getElementById('canvas'), config);
                        rnnPlayer.start(combinedSequence);
                        
                    })
                    .catch((error) => {
                        console.error('Error al reproducir la secuencia:', error);
                    });
            }).catch((error) => {
                console.error('Error al iniciar AudioContext:', error);
            });



        };

        if (button) {
            button.addEventListener('click', handleClick);
        }

        // Limpieza para evitar duplicados
        return () => {
            if (button) {
                button.removeEventListener('click', handleClick);
            }
        };



    }, []);

    return (
        <div className="flex flex-col items-center">   
            <h1>FLOW-FI</h1>
            <canvas id="canvas" className=" bg-black border border-gray-700"></canvas>
            <button id="button">Play</button>
            <script src="https://cdn.jsdelivr.net/npm/@magenta/music@^1.23.1"></script>
        </div>
    );
}
