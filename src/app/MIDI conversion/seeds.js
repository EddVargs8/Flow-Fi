export const seeds = {
    drumsSeeds: [
      { 
        id: 1,
        ticksPerQuarter: 220,
        totalQuantizedSteps: 8,
        quantizationInfo: { stepsPerQuarter: 4 },
        notes: [
          { pitch: 30, quantizedStartStep: 0, quantizedEndStep: 1 },
          { pitch: 40, quantizedStartStep: 1, quantizedEndStep: 2 },
          { pitch: 30, quantizedStartStep: 4, quantizedEndStep: 5 },
          { pitch: 40, quantizedStartStep: 5, quantizedEndStep: 6 },
          { pitch: 40, quantizedStartStep: 7, quantizedEndStep: 8 }
        ]
      },
      { 
        id: 2,
        ticksPerQuarter: 220,
        totalQuantizedSteps: 8,
        quantizationInfo: { stepsPerQuarter: 4 },
        notes: [
          { pitch: 36, quantizedStartStep: 0, quantizedEndStep: 1 },
          { pitch: 42, quantizedStartStep: 0, quantizedEndStep: 1 },
          { pitch: 42, quantizedStartStep: 2, quantizedEndStep: 3 },
          { pitch: 36, quantizedStartStep: 4, quantizedEndStep: 5 },
          { pitch: 42, quantizedStartStep: 4, quantizedEndStep: 5 },
          { pitch: 42, quantizedStartStep: 6, quantizedEndStep: 7 }
        ]
      },
      {
        id: 3,
        ticksPerQuarter: 220,
        totalQuantizedSteps: 8,
        quantizationInfo: { stepsPerQuarter: 4 },
        notes: [
          { pitch: 36, quantizedStartStep: 0, quantizedEndStep: 1 }, // Kick
          { pitch: 42, quantizedStartStep: 0, quantizedEndStep: 1 }, // Hi-hat
          { pitch: 42, quantizedStartStep: 1, quantizedEndStep: 2 }, // Hi-hat
          { pitch: 36, quantizedStartStep: 3, quantizedEndStep: 4 }, // Kick
          { pitch: 42, quantizedStartStep: 4, quantizedEndStep: 5 }, // Hi-hat
          { pitch: 36, quantizedStartStep: 6, quantizedEndStep: 7 }, // Kick
          { pitch: 42, quantizedStartStep: 6, quantizedEndStep: 7 }  // Hi-hat
        ]
      }, 
      {
        id: 4,
        ticksPerQuarter: 220,
        totalQuantizedSteps: 8,
        quantizationInfo: { stepsPerQuarter: 4 },
        notes: [
          { pitch: 42, quantizedStartStep: 0, quantizedEndStep: 1 }, // Hi-hat
          { pitch: 42, quantizedStartStep: 2, quantizedEndStep: 3 }, // Hi-hat
          { pitch: 42, quantizedStartStep: 4, quantizedEndStep: 5 }, // Hi-hat
          { pitch: 42, quantizedStartStep: 6, quantizedEndStep: 7 }  // Hi-hat
        ]
      }, 
      {
        id: 5,
        ticksPerQuarter: 220,
        totalQuantizedSteps: 8,
        quantizationInfo: { stepsPerQuarter: 4 },
        notes: [
          { pitch: 36, quantizedStartStep: 0, quantizedEndStep: 1 }, // Kick
          { pitch: 42, quantizedStartStep: 1, quantizedEndStep: 2 }, // Hi-hat
          { pitch: 36, quantizedStartStep: 3, quantizedEndStep: 4 }, // Kick
          { pitch: 42, quantizedStartStep: 4, quantizedEndStep: 5 }, // Hi-hat
          { pitch: 42, quantizedStartStep: 6, quantizedEndStep: 7 }  // Hi-hat
        ]
      },
   
      
      
    ],
  
    melodySeeds: [ /* Arreglo de patrones para Lookback RNN */ ],
    bassSeeds: [ /* Arreglo de patrones para Basic Improv */ ]
  };
  
  