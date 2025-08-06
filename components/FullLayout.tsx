// components/FullLayout.tsx
import Head from 'next/head';
import { ReactNode } from 'react';

export default function FullLayout({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
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

        {/* 🧠 Content */}
        <div className="relative z-20">{children}</div>
      </div>
    </>
  );
}