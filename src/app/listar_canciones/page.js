// Listar canciones page

export default function Page() {
    return (
      <div className="flex flex-col items-center p-4">
        {/* Fila para Drums */}
        <div className="flex items-center w-full max-w-md my-2">
          <span className="text-green-600 font-semibold w-20">Drums</span>
          <button
            className="bg-gray-300 px-4 py-1 rounded-md mx-2"
          >
            Genera
          </button>
          <canvas
            id="drumsCanvas"
            className="flex-grow bg-gray-200 rounded-md h-32"
          ></canvas>
        </div>
  
        {/* Fila para Piano */}
        <div className="flex items-center w-full max-w-md my-2">
          <span className="text-green-600 font-semibold w-20">Piano</span>
          <button
            className="bg-gray-300 px-4 py-1 rounded-md mx-2"
          >
            Genera
          </button>
          <canvas
            id="pianoCanvas"
            className="flex-grow bg-gray-200 rounded-md h-32"
          ></canvas>
        </div>
  
        {/* Fila para Bass */}
        <div className="flex items-center w-full max-w-md my-2">
          <span className="text-green-600 font-semibold w-20">Bass</span>
          <button
            className="bg-gray-300 px-4 py-1 rounded-md mx-2"
          >
            Genera
          </button>
          <canvas
            id="bassCanvas"
            className="flex-grow bg-gray-200 rounded-md h-32"
          ></canvas>
        </div>
  
        {/* Botón para unir canción */}
        <button
          className="mt-6 bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600"
        >
          Unir canción
        </button>
      </div>
    );
  }
  