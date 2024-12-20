import localFont from "next/font/local";
import "./globals.css";
import Authsession from "./components/authsession";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Flow-Fi",
  description: "IA project for music creation",
  icons: {
    icon: "/images/logos/icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    

    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} >
        <Authsession>{children}</Authsession>
      </body>
    </html>
    
  );
}
