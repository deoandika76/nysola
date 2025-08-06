// components/FullLayout.tsx
import Head from 'next/head';
import { ReactNode } from 'react';
import Header from './Header';
import Navbar from './Navbar';
import { useState } from 'react';

export default function FullLayout({
  children,
@@ -9,24 +12,25 @@ export default function FullLayout({
  children: ReactNode;
  title?: string;
}) {
  const [navbarOpen, setNavbarOpen] = useState(false);

  return (
    <>
      <Head>
        <title>{title ?? 'Nysola'}</title>
      </Head>

      <div className="relative min-h-screen text-white pt-20 px-6 md:px-16 pb-12">
        {/* 🔮 Background Image (cosmic) */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: "url('/cosmic-bg.jpg')" }}
        />

        {/* 🟣 Overlay + blur */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10" />
      <Header onToggleNavbar={() => setNavbarOpen(!navbarOpen)} />
      <Navbar isOpen={navbarOpen} onClose={() => setNavbarOpen(false)} />

        {/* 🧠 Content */}
        <div className="relative z-20">{children}</div>
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