// components/FullLayout.tsx
import Head from 'next/head';
import { ReactNode } from 'react';
import Header from './Header';
import Navbar from './Navbar';
import { useState } from 'react';

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

      {/* Background image dari public/bg-cosmic.jpg */}
      <div
        className="min-h-screen bg-cover bg-center"
        style={{ backgroundImage: 'url(/bg-cosmic.jpg)' }}
      >
        <div className="min-h-screen bg-black/40 backdrop-blur-md pt-24 px-6 md:px-16 pb-12">
          {children}
        </div>
      </div>
    </>
  );
}