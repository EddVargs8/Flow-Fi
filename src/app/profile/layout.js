// Profile Layout

import Navbar_Layout from '../components/navbar_Layout';

export default function Profile({ children }) {
  const isAuthenticated = true;

  return (
    <Navbar_Layout isAuthenticated={isAuthenticated}>
      <main> {children} </main> 
    </Navbar_Layout>
  );
}