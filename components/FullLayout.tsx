// components/FullLayout.tsx
import Head from 'next/head';
import { ReactNode } from 'react';

interface FullLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function FullLayout({ children, title }: FullLayoutProps) {
  return (
    <>
      <Head>
        <title>{title ? `${title} - Nysola` : 'Nysola'}</title>
      </Head>
      <main className="pt-20 px-6 md:px-16 pb-12 bg-black min-h-screen text-white">
        {children}
      </main>
    </>
  );
}