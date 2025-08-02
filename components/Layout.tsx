// components/Layout.tsx
import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Header from './Header';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar isOpen={true} />
      <Navbar isOpen={navOpen} onClose={() => setNavOpen(false)} />
      <div className="flex flex-col w-full">
        <Header onToggleNavbar={() => setNavOpen(!navOpen)} />
        <main className="mt-20 md:mt-0 md:ml-64 w-full p-4 sm:p-6 md:p-8 bg-carbon text-white min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}