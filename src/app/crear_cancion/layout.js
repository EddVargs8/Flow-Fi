// Crear Cancion Layout

import Navbar_Layout from '../components/navbar_Layout';

export default function Crear ({ children }) {
  const isAuthenticated = true;
  
  return (
    <Navbar_Layout isAuthenticated={isAuthenticated}>
      <main> {children} </main> 
    </Navbar_Layout>
  );
}