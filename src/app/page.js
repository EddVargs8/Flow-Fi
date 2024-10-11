import Navbar_Layout from './components/navbar_Layout';
import { prisma } from './utils/prisma';


export default async function Home() {
  const user = await prisma.user.findUnique({
    where: {
      id: 1, 
    },
  });

  const userData = {
    id: user.id,
    email: user?.email,
  };

  return (
    <Navbar_Layout>
      <h1>User Profile, DATABASE WORKING! </h1>
      <p>Id: {userData.id}</p>
      <p>Email: {userData.email}</p>
    </Navbar_Layout>
  );
}

