export const pianoSeeds = [
  {
    quantizationInfo: { stepsPerQuarter: 4 },
    notes: [
      { pitch: 62, quantizedStartStep: 0, quantizedEndStep: 4 }, // D (Dm7)
      { pitch: 65, quantizedStartStep: 4, quantizedEndStep: 8 }, // F (Dm7)
      { pitch: 69, quantizedStartStep: 8, quantizedEndStep: 12 }, // A (Dm7)
      { pitch: 72, quantizedStartStep: 12, quantizedEndStep: 16 }, // C (Dm7)
    ],
    totalQuantizedSteps: 16,
    tempos: [{ time: 0, qpm: 65 }],
  },
  {
    quantizationInfo: { stepsPerQuarter: 4 },
    notes: [
      { pitch: 67, quantizedStartStep: 0, quantizedEndStep: 4 }, // G (G7)
      { pitch: 71, quantizedStartStep: 4, quantizedEndStep: 8 }, // B (G7)
      { pitch: 74, quantizedStartStep: 8, quantizedEndStep: 12 }, // D (G7)
      { pitch: 77, quantizedStartStep: 12, quantizedEndStep: 16 }, // F (G7)
    ],
    totalQuantizedSteps: 16,
    tempos: [{ time: 0, qpm: 70 }],
  },
  {
    quantizationInfo: { stepsPerQuarter: 4 },
    notes: [
      { pitch: 60, quantizedStartStep: 0, quantizedEndStep: 4 }, // C (Cmaj7)
      { pitch: 64, quantizedStartStep: 4, quantizedEndStep: 8 }, // E (Cmaj7)
      { pitch: 67, quantizedStartStep: 8, quantizedEndStep: 12 }, // G (Cmaj7)
      { pitch: 71, quantizedStartStep: 12, quantizedEndStep: 16 }, // B (Cmaj7)
    ],
    totalQuantizedSteps: 16,
    tempos: [{ time: 0, qpm: 60 }],
  },
];

export const bassSeeds = [
  {
    quantizationInfo: { stepsPerQuarter: 4 },
    notes: [
      { pitch: 50, quantizedStartStep: 0, quantizedEndStep: 4 }, // D (Dm7)
      { pitch: 53, quantizedStartStep: 4, quantizedEndStep: 8 }, // F (Dm7)
    ],
    totalQuantizedSteps: 16,
    tempos: [{ time: 0, qpm: 65 }],
  },
  {
    quantizationInfo: { stepsPerQuarter: 4 },
    notes: [
      { pitch: 53, quantizedStartStep: 0, quantizedEndStep: 4 }, // G (G7)
      { pitch: 48, quantizedStartStep: 4, quantizedEndStep: 8 }, // B (G7)
    ],
    totalQuantizedSteps: 16,
    tempos: [{ time: 0, qpm: 65 }],
  },
  {
    quantizationInfo: { stepsPerQuarter: 4 },
    notes: [
      { pitch: 48, quantizedStartStep: 0, quantizedEndStep: 4 }, // C (Cmaj7)
      { pitch: 52, quantizedStartStep: 4, quantizedEndStep: 8 }, // E (Cmaj7)
    ],
    totalQuantizedSteps: 16,
    tempos: [{ time: 0, qpm: 65 }],
  },
];

export const drumsSeeds = [
  {
    quantizationInfo: { stepsPerQuarter: 4 },
    notes: [
      { pitch: 36, quantizedStartStep: 0, quantizedEndStep: 2 }, // Kick
      { pitch: 42, quantizedStartStep: 2, quantizedEndStep: 4 }, // Hi-hat
      { pitch: 38, quantizedStartStep: 4, quantizedEndStep: 6 }, // Snare
    ],
    totalQuantizedSteps: 16,
  },
  {
    quantizationInfo: { stepsPerQuarter: 4 },
    notes: [
      { pitch: 36, quantizedStartStep: 0, quantizedEndStep: 2 }, // Kick
      { pitch: 42, quantizedStartStep: 2, quantizedEndStep: 4 }, // Hi-hat
      { pitch: 38, quantizedStartStep: 4, quantizedEndStep: 6 }, // Snare
      { pitch: 42, quantizedStartStep: 6, quantizedEndStep: 8 }, // Hi-hat
    ],
    totalQuantizedSteps: 16,
  },
  {
    quantizationInfo: { stepsPerQuarter: 4 },
    notes: [
      { pitch: 36, quantizedStartStep: 0, quantizedEndStep: 2 }, // Kick
      { pitch: 42, quantizedStartStep: 2, quantizedEndStep: 4 }, // Hi-hat
      { pitch: 38, quantizedStartStep: 4, quantizedEndStep: 6 }, // Snare
      { pitch: 46, quantizedStartStep: 6, quantizedEndStep: 8 }, // Open hi-hat
    ],
    totalQuantizedSteps: 16,
  },
];

