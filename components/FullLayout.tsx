import { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface FullLayoutProps {
  children: ReactNode;
  title?: string; // ✅ Tambahin ini biar nggak error pas dipanggil
}

export default function FullLayout({ children }: FullLayoutProps) {
  return (
    <div className="flex">
      <Sidebar isOpen={true} />
      <main className="md:ml-64 w-full p-4 sm:p-6 md:p-8 bg-black text-white min-h-screen">
        {children}
      </main>
    </div>
  );
}