import React, { useRef, useEffect } from 'react';

// Componente para cada instrumento
const InstrumentRow = ({ instrument, onGenerate, onPlay, canvasId }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Aquí puedes inicializar PianoRollCanvasVisualizer
    // Asegúrate de importar PianoRollCanvasVisualizer y configurarlo adecuadamente
    if (canvasRef.current) {
      // Ejemplo de inicialización del visualizador:
      // const visualizer = new PianoRollCanvasVisualizer(sequence, canvasRef.current);
      // Puedes pasarle la secuencia generada para cada instrumento
    }
  }, []);

  return (
    <div className="flex items-center w-full max-w-md my-2">
      <span className="text-green-600 font-semibold w-20">{instrument}</span>
      <button
        onClick={() => onGenerate(instrument)}
        className="bg-gray-300 px-4 py-1 rounded-md mx-2"
      >
        Genera
      </button>
      <canvas
        id={canvasId}
        ref={canvasRef}
        className="flex-grow bg-gray-400 rounded-md h-10"
      ></canvas>
    </div>
  );
};

// Componente principal para crear la canción
const CreateSong = () => {
  const handleGenerate = (instrument) => {
    // Lógica para generar la secuencia para el instrumento especificado
    console.log(`Generando secuencia para ${instrument}`);
  };

  const handleCombineTracks = () => {
    // Lógica para combinar las pistas y crear la canción final
    console.log("Unir canción");
  };

  return (
    <div className="flex flex-col items-center p-4">
      <InstrumentRow
        instrument="Drums"
        onGenerate={handleGenerate}
        canvasId="drumsCanvas"
      />
      <InstrumentRow
        instrument="Piano"
        onGenerate={handleGenerate}
        canvasId="pianoCanvas"
      />
      <InstrumentRow
        instrument="Bass"
        onGenerate={handleGenerate}
        canvasId="bassCanvas"
      />

      <button
        onClick={handleCombineTracks}
        className="mt-6 bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600"
      >
        Unir canción
      </button>
    </div>
  );
};

export default CreateSong;
