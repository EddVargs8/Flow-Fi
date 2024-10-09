// Crear Cancion Layout

import Navbar_Layout from '../components/navbar_Layout';

export default function Crear ({ children }) {
  return (
    <Navbar_Layout>
      <main> {children} </main> 
    </Navbar_Layout>
  );
}