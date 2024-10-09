// Login layout

import LoginLayout from '../components/login_Layout';

export default function Login({ children }) {
  return (
    <LoginLayout>
        <html lang="en" className="h-full bg-white">
        <body className="h-full">
            <main> {children} </main>
        </body>
      </html>
       
    </LoginLayout>
  );
}

