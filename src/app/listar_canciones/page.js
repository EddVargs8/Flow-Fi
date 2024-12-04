'use client'
import { useEffect, useState } from "react";

export default function Example() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSongs() {
      try {
        const response = await fetch("/api/list_songs");
        if (!response.ok) {
          throw new Error("Error al cargar las canciones");
        }
        const data = await response.json();
        setSongs(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchSongs();
  }, []);

  function playSong(blobData) {
    try {
      const blob = new Blob([new Uint8Array(blobData.data)], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error("Error al reproducir la canción:", error);
    }
  }
  

  // Función para descargar la canción desde el blobData
  function downloadSong(blobData, title) {
    const uint8Array = new Uint8Array(blobData.data);
    const blob = new Blob([uint8Array], { type: "audio/wav" });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `${title}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="flex flex-col items-center min-h-screen pt-16 bg-gray-50">
      <h1 className="text-2xl font-bold text-teal-700 mb-8">Mis Canciones</h1>
      {loading ? (
        <p className="text-gray-500">Cargando canciones...</p>
      ) : songs.length === 0 ? (
        <p className="text-gray-500">No tienes canciones descargadas aún.</p>
      ) : (
        <ul role="list" className="w-full max-w-2xl bg-white shadow-lg rounded-lg divide-y divide-gray-200">
          {songs.map((song) => (
            <li
              key={song.id}
              className="flex justify-between items-center gap-x-6 py-4 px-6 hover:bg-teal-50 transition-all"
            >
              <div className="flex items-center gap-x-4">
                <button
                  onClick={() => playSong(song.blobData)}
                  className="flex items-center justify-center w-10 h-10 bg-teal-700 rounded-full shadow hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  <img src="/images/play.png" alt="Play" className="w-5 h-5" />
                </button>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{song.title}</p>
                  <p className="text-xs text-gray-500">
                    Fecha de creación: {new Date(song.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-sm text-gray-900">
                  Duración: {song.duration ? `${Math.floor(song.duration / 60)}:${song.duration % 60}` : "N/A"}
                </p>
                <button
                  onClick={() => downloadSong(song.blobData, song.title)}
                  className="mt-2 text-xs text-teal-600 hover:underline"
                >
                  Descargar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
