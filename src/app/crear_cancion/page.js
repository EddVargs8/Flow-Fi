// Crear cancion page
"use client";

import { useEffect } from 'react';
import { seeds } from '../seeds';

export default function Page() {
    useEffect(() => {
        let viz = null; 
        const drums_rnn = new mm.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/drum_kit_rnn');
        drums_rnn.initialize();
        

        const rnnPlayer = new mm.Player(false, {
            run: (note) => { 
                viz.redraw(note); // Actualiza la visualización de la nota activa
            },
            stop: () => {
                console.log('Player detenido.');
            }
        });

        const playBtn = document.getElementById('play');
        const stopBtn = document.getElementById('stop');

        function getRandomSeed(seedsArray) {
            const randomIndex = Math.floor(Math.random() * seedsArray.length);
            return seedsArray[randomIndex];
        }

        function setupVisualizer(sequence) {
            const config = {
                noteHeight: 10,
                pixelsPerTimeStep: 200,  // like a note width
                noteSpacing: 2,
                noteRGB: '194, 24, 7',
                activeNoteRGB: '87, 35, 100',
            };
    
            viz = new mm.PianoRollCanvasVisualizer(sequence, document.getElementById('canvas'), config);
        }

        const playClick = () => {
            
            const randomDrumSeed = getRandomSeed(seeds.drumsSeeds);
            console.log('Secuencia aleatoria:', randomDrumSeed.id);
            setupVisualizer(randomDrumSeed);



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
                drums_rnn.continueSequence(randomDrumSeed, 24, 0.8)
                    .then((sample) => {
                        console.log('Iniciando nueva secuencia.');

                        const offset = randomDrumSeed.totalQuantizedSteps;
                            sample.notes.forEach(note => {
                            note.quantizedStartStep += offset;
                            note.quantizedEndStep += offset;
                        });

                        // Combina `randomDrumSeed` con `sample` en `combinedSequence`
                        const combinedSequence = {
                            ...randomDrumSeed,
                            notes: [...randomDrumSeed.notes, ...sample.notes],
                            totalQuantizedSteps: randomDrumSeed.totalQuantizedSteps + sample.totalQuantizedSteps,
                        };
                        setupVisualizer(combinedSequence);
                        rnnPlayer.start(combinedSequence);
                        
                    })
                    .catch((error) => {
                        console.error('Error al reproducir la secuencia:', error);
                    });
            }).catch((error) => {
                console.error('Error al iniciar AudioContext:', error);
            });



        };
        
        const stopClick = () => {
            if (rnnPlayer.isPlaying()) {
                rnnPlayer.stop(); // Detiene la secuencia en reproducción
            } else {
                console.log('No hay secuencia en reproducción.');
            }
        };
        
        

        if (playBtn) 
            playBtn.addEventListener('click', playClick);
        if (stopBtn)
            stopBtn.addEventListener('click', stopClick);

        // Limpieza para evitar duplicados
        return () => {
            if (playBtn) 
                playBtn.removeEventListener('click', playClick);
            if (stopBtn)
                stopBtn.removeEventListener('click', stopClick);
        };



    }, []);

    return (
        <div className="flex flex-col items-center">   
            <h1>FLOW-FI</h1>
            <canvas id="canvas" className=" bg-black border border-gray-700"></canvas>
            <button id="play">Play</button>
            <button id="stop">Stop</button>
            <script src="https://cdn.jsdelivr.net/npm/@magenta/music@^1.23.1"></script>
        </div>
    );
}
