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
            totalQuantizedSteps: 16,
          };
      
          const config = {
            noteHeight: 10,
            pixelsPerTimeStep: 200,  // like a note width
            noteSpacing: 2,
            noteRGB: '194, 24, 7',
            activeNoteRGB: '40, 184, 229',
          };
      
          const canvas = document.getElementById('canvas');
          const viz = new mm.Visualizer(MELODY, canvas, config);
      
          const vizPlayer = new mm.SoundFontPlayer(
            'https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus',
            undefined,
            undefined,
            undefined,
            {
              run: (note) => viz.redraw(note),
              stop: () => { console.log('done'); }
            }
          );
      
          const play = () => {
            vizPlayer.loadSamples(MELODY).then(() => {
              vizPlayer.start(MELODY);
            });
          };
      
          const button = document.getElementById('button');
          if (button) {
            button.addEventListener('click', play);
          }
      
          return () => {
            if (button) {
              button.removeEventListener('click', play);
            }
          };
        
  

    }, []);

    return (
        <div>
            <h1> FLOW-FI</h1>
            <div className="flex flex-col items-center">    
                <canvas id="canvas" className="w-full h-64 bg-black border border-gray-700"></canvas>
                <button id="button">Play</button>
                <script src="https://cdn.jsdelivr.net/npm/@magenta/music@^1.23.1"></script>

            </div>
            
        </div>
    );
}
