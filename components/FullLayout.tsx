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
        className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/bg-cosmic.jpg')" }}
      >
        {/* Overlay transparan + blur */}
        <div className="min-h-screen w-full backdrop-blur-sm bg-black/70 px-6 pt-20 pb-12 md:px-16">
          {children}
        </div>
      </div>
    </>
  );
}