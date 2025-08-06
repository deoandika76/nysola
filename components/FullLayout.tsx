// components/FullLayout.tsx
import Head from 'next/head';
import { ReactNode, useState } from 'react';
import Header from './Header';
import Navbar from './Navbar';

export default function FullLayout({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  const [navbarOpen, setNavbarOpen] = useState(false);

  return (
    <>
      <Head>
        <title>{title ?? 'Nysola'}</title>
      </Head>

      <Header onToggleNavbar={() => setNavbarOpen(!navbarOpen)} />
      <Navbar isOpen={navbarOpen} onClose={() => setNavbarOpen(false)} />

      <div
        className="min-h-screen bg-cover bg-center"
        style={{
          backgroundImage: "url('/bg-cosmic.jpg')", // <- pastikan ini sesuai nama file lo
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Ini overlay agar content tetap kebaca */}
        <div className="min-h-screen w-full pt-24 px-6 md:px-16 pb-12 bg-black/50">
          {/* Kalo mau blur, tambahin backdrop-blur-sm */}
          {children}
        </div>
      </div>
    </>
  );
}