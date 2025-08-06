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
      <div
        className="min-h-screen bg-black/30 text-white pt-20 px-6 md:px-16 pb-12"
        style={{
          backgroundImage: "url('/cosmic-bg.jpg')", // ganti sesuai filemu
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {children}
      </div>
    </>
  );
}