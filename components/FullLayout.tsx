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
        className="min-h-screen pt-20 px-6 md:px-16 pb-12 text-white bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/bg-cosmic.jpg')" }}
      >
        {/* ✨ Overlay biar tulisan tetap kebaca */}
        <div className="backdrop-blur-sm bg-black/70 min-h-screen p-4 rounded-xl">
          {children}
        </div>
      </div>
    </>
  );
}