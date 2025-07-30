// components/Header.tsx // HEHEH
import { useState } from 'react';
import NotificationDropdown from './NotificationDropdown';
import { Bars3Icon } from '@heroicons/react/24/solid';

export default function Header({ onToggleNavbar }: { onToggleNavbar: () => void }) {
  const [showNotif, setShowNotif] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-carbon text-white shadow-lg z-50 flex items-center justify-between px-6 py-4">
      <h1 className="text-xl font-bold text-orchid font-futuristic">NYSOLA AI OPS</h1>

      <div className="flex items-center space-x-4">
        {/* 🔔 Bell Icon */}
        <button
          onClick={() => setShowNotif((prev) => !prev)}
          className="relative focus:outline-none"
        >
          <span className="text-white text-2xl">🔔</span>
          {showNotif && (
            <div className="absolute right-0 mt-2 w-80">
              <NotificationDropdown />
            </div>
          )}
        </button>

        {/* ☰ Navbar Toggle */}
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