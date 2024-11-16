// Listar canciones page

const navigation = [
  { name: 'Inicio', href: '/', current: true },
  { name: 'Crear Cancion', href: '/crear_cancion', current: false },
  { name: 'Mis canciones', href: '/listar_canciones', current: false },
]

export default function Page() {
    return (
      <h1> Listar canciones </h1>
    );
  }
  