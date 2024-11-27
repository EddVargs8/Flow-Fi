'use client'

import { useSession } from "next-auth/react";

const navigation = [
  { name: 'Inicio', href: '/', current: true },
  { name: 'Crear Canción', href: '/crear_cancion', current: false },
  { name: 'Mis Canciones', href: '/listar_canciones', current: false, protected: true },
]

export default function Navbar({ isAuthenticated, children }) {
  const { data: session } = useSession(); 

  return (
    <>
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50 bg-gradient-to-r from-[#023C3C] via-[#02514E] to-[#027F7F] shadow-md h-20">
        <nav aria-label="Global" className="flex items-center justify-between h-full p-6 lg:px-8">
          {/* Logo */}
          <div className="flex lg:flex-1 ml-14">
            <a href="/" className="p-2 mt-1">
              <span className="sr-only">Flow-Fi</span>
              <img
                alt="Flow-Fi"
                src="/images/logos/logo.png"
                className="h-12 w-auto"
                style={{ transform: 'scale(2.5)' }}
              />
            </a>
          </div>

          {/* Links */}
          <div className="flex lg:gap-x-12">
      {navigation
        .filter((item) => !item.protected || (item.protected && session)) // Muestra solo enlaces permitidos
        .map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="text-sm font-semibold text-white hover:text-[#f0fdfa] px-4 py-2 rounded-md border border-transparent hover:border-white"
          >
            {item.name}
          </a>
        ))}
    </div>
          {/* Right-side actions */}
          <div className="flex lg:flex-1 lg:justify-end">
          {session ? (
              <a
                href="/profile"
                className="text-sm font-semibold text-white hover:text-[#f0fdfa] px-4 py-2 rounded-md border border-transparent hover:border-white"
              >
                Mi Perfil
              </a>
            ) : (
              <a
                href="/login"
                className="text-sm font-semibold text-white hover:text-[#f0fdfa] px-4 py-2 rounded-md border border-transparent hover:border-white"
              >
                Inicia Sesión <span aria-hidden="true">&rarr;</span>
              </a>
            )}
          </div>
        </nav>
      </header>

      {/* Main content */}
      <main className="pt-20">{children}</main> {/* Agregamos padding-top aquí */}
    </>
  )
}

