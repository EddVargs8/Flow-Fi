import Navbar_Layout from './components/navbar_Layout';
import { prisma } from './utils/prisma';

async function getUserById(id) {
  const user = await prisma.user.findUnique({
    where: {
      id: id, 
    },
  })
  return user
}

// Llamada a la función para obtener el usuario por id
getUserById(1).then(user => console.log(user)).catch(err => console.error(err))

export default function Home() {
  return (
    <Navbar_Layout>
      <p> Home Page </p>
    </Navbar_Layout>
  );
}

