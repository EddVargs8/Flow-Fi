'use client'

const navigation = [
  
]

const isAuthenticated = false;

export default function Example() {
  return (
    <div className="bg-gradient-to-b from-white via-[#027F7F33] to-[#023C3C4D] min-h-screen">
      <header className="fixed inset-x-0 top-0 z-50 bg-white shadow-md">
        <nav aria-label="Global" className="flex items-center justify-between p-4 lg:px-8">
          <div className="flex lg:flex-1 ml-14">
            <a href="/" className="p-1.5">
              <span className="sr-only">Flow-Fi</span>
              <img
                alt="Flow-Fi"
                src="/images/logos/name.png"
                className="h-12 w-auto scale-250"
                style={{ transform: 'scale(2.5)' }}
              />
            </a>
          </div>
          <div className="hidden lg:flex lg:gap-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-semibold text-gray-800 hover:text-[#023C3C] px-4 py-2 rounded-md border border-transparent hover:border-[#023C3C] hover:bg-[#f0fdfa]"
              >
                {item.name}
              </a>
            ))}
          </div>
          <div className="flex lg:flex-1 lg:justify-end">
            {isAuthenticated ? (
              <a
                href="/profile"
                className="text-sm font-semibold text-gray-800 hover:text-[#023C3C] px-4 py-2 rounded-md border border-transparent hover:border-[#023C3C] hover:bg-[#f0fdfa]"
              >
                Mi Perfil
              </a>
            ) : (
              <a
                href="/login"
                className="text-sm font-semibold text-gray-800 hover:text-[#023C3C] px-4 py-2 rounded-md border border-transparent hover:border-[#023C3C] hover:bg-[#f0fdfa]"
              >
                Inicia Sesión <span aria-hidden="true">&rarr;</span>
              </a>
            )}
          </div>
        </nav>
      </header>

      <div className="relative isolate px-6 pt-20 lg:px-8">
        <div className="mx-auto max-w-2xl py-12 sm:py-16 lg:py-20">
          <div className="text-center">
            <h1 className="text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
              Flow-Fi: Crea tu propia música Lo-Fi
            </h1>
            <p className="mt-8 text-lg font-medium text-gray-600 sm:text-xl">
              Genera canciones relajantes del género Lo-Fi con un solo clic. Regístrate, guarda tus melodías favoritas y descárgalas fácilmente.
            </p>
            <br />
            <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
              Flow-Fi se basa en inteligencia artificial con Magenta.js para generar música Low-Fi de forma automática. Combina modelos avanzados para crear patrones de batería, melodías y bajos, ofreciendo una experiencia única y relajante al instante.
            </div>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="/crear_cancion"
                className="rounded-md bg-gradient-to-r from-[#02514E] to-[#027F7F] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gradient-to-br"
              >
                Crear una canción
              </a>
              <a href="https://magenta.tensorflow.org/get-started" className="text-sm font-semibold text-gray-900 hover:text-[#02514E]"
                target="_blank"
                rel="noopener noreferrer"
              >
                Aprende sobre Magenta.JS <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
