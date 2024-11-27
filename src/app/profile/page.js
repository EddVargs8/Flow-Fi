'use client';

import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Page() {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user");
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session) fetchUser();
  }, [session]);

  if (loading) return <div className="text-white text-center">Cargando...</div>;
  if (!session) return <div className="text-white text-center">No has iniciado sesión.</div>;
  if (!user) return <div className="text-white text-center">No se pudo cargar la información del usuario.</div>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-[#023C3C4D] via-[#027F7F33] to-white pt-16">
      <div className="w-80 px-4 py-4 text-center bg-white rounded-lg shadow-md">
        <div className="space-y-3">
          <img
            className="mx-auto rounded-full h-28 w-28"
            src="/images/user.png"
            alt="User Avatar"
          />
          <div className="space-y-1">
            <div className="flex flex-col items-center space-y-2 text-md font-medium">
              <h3 className="text-[#023C3C]">{user.username}</h3>
              <p className="text-gray-600">{user.bio || "Sin descripción"}</p>
              <p className="text-sm text-gray-500">
                Miembro desde: {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="mt-4 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
