// components/Header.tsx
import { Bars3Icon } from '@heroicons/react/24/solid';
import NotificationDropdown from './NotificationDropdown';
import Link from 'next/link';

export default function Header({ onToggleNavbar }: { onToggleNavbar: () => void }) {
  return (
    <header className="fixed top-0 left-0 w-full bg-carbon/60 backdrop-blur-md text-white shadow-lg z-50 flex items-center justify-between px-6 py-4">
      {/* 👉 Judul yang bisa diklik balik ke Dashboard */}
      <Link href="/dashboard">
        <h1 className="text-xl font-bold text-orchid font-futuristic cursor-pointer hover:text-cyan transition">
          NYSOLA AI OPS
        </h1>
      </Link>

      <div className="flex items-center space-x-4">
        <NotificationDropdown />
        <button
          onClick={onToggleNavbar}
          className="text-white hover:text-cyan transition"
        >
          <Bars3Icon className="h-7 w-7" />
        </button>
      </div>
    </header>
  );
}