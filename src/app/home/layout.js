// Main Layout

import Navbar_Layout from '../components/navbar_Layout';

export default function Home({ children }) {
  return (
    <Navbar_Layout>
      <main> {children} </main> 
    </Navbar_Layout>
  );
}
