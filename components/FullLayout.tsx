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
      <div className="min-h-screen bg-black text-white pt-20 px-6 md:px-16 pb-12">
        {children}
      </div>
    </>
  );
}