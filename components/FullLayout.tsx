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
        className="min-h-screen text-white pt-20 px-6 md:px-16 pb-12"
        style={{
          backgroundImage: "url('/cosmic-bg.jpg')", // pastikan file ini ada di folder public
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="bg-black/40 min-h-screen w-full rounded-xl p-4">
          {children}
        </div>
      </div>
    </>
  );
}