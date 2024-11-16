import Link from 'next/link'

export default function LoginLayout({ children }) {
  return (
    <>
      <div className="flex min-h-screen flex-1 flex-col justify-start px-6 py-8 lg:px-8 bg-gradient-to-b from-white via-[#027F7F33] to-[#023C3C4D]">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="FLOW-FI"
            src="/images/logos/name.png"
            className="mx-auto h-40 w-40"
          />
          <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Inicia Sesión
          </h2>
        </div>

        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action="#" method="POST" className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Correo Electrónico
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#027F7F] sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Contraseña
                </label>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-[#027F7F] hover:text-[#02514E]">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#027F7F] sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <Link
              href="/"
              className="flex w-full justify-center rounded-md bg-[#027F7F] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#02514E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#023C3C]"
            >
              Iniciar Sesión
            </Link>
          </form>
        </div>
      </div>
    </>
  )
}
