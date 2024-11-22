// Profile page
'use client'
import { signOut } from "next-auth/react";

export default function Page() {
    return (
        <button
          onClick={() => signOut({ callbackUrl: "/" })} // Redirige al home después de logout
          className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Cerrar sesión
        </button>
      );
} 