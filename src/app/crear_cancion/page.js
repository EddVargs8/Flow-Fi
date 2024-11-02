// Crear cancion page
"use client";

import { useEffect } from 'react';
import { getRandomNoteSequence } from '../MIDI conversion/conversion';

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

        const playClick = async () => {
            try {
                // Espera a que `getRandomNoteSequence()` retorne el `NoteSequence`
                const randomDrumSeed = await getRandomNoteSequence();
                
                if (!randomDrumSeed) {
                    console.error("No se pudo cargar el NoteSequence.");
                    return;
                }
        
                // Cuantizar el NoteSequence
                const quantizedSequence = mm.sequences.quantizeNoteSequence(randomDrumSeed, 4);
                //console.log("Quantized Sequence:", quantizedSequence);
        
                // Define totalQuantizedSteps en caso de que no esté definido
                quantizedSequence.totalQuantizedSteps = quantizedSequence.totalQuantizedSteps || quantizedSequence.notes[quantizedSequence.notes.length - 1].quantizedEndStep;
        
                // Visualizar la secuencia cuantizada
                //setupVisualizer(quantizedSequence);
        
                // Iniciar AudioContext y continuar la secuencia con el modelo de drums
                await mm.Player.tone.start();
                
                const sample = await drums_rnn.continueSequence(quantizedSequence, 32, 1);
        
                //const offset = quantizedSequence.totalQuantizedSteps;
                //sample.notes.forEach(note => {
                //    note.quantizedStartStep += offset;
                //    note.quantizedEndStep += offset;
                //});
        
                // Combina `quantizedSequence` con `sample` en `combinedSequence`
                //const combinedSequence = {
                 //   ...quantizedSequence,
                 //   notes: [...quantizedSequence.notes, ...sample.notes],
                 //   totalQuantizedSteps: quantizedSequence.totalQuantizedSteps + sample.totalQuantizedSteps,
                //};
        
                setupVisualizer(sample);
                rnnPlayer.start(sample);
        
            } catch (error) {
                console.error('Error en playClick:', error);
            }
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
