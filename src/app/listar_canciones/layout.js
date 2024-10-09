// Listar canciones Layout

import Navbar_Layout from '../components/navbar_Layout';

export default function Listar({ children }) {
  return (
    <Navbar_Layout>
      <main> {children} </main> 
    </Navbar_Layout>
  );
}
