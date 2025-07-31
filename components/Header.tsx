// components/Header.tsx
import { Bars3Icon } from '@heroicons/react/24/solid';
import NotificationDropdown from './NotificationDropdown';

export default function Header({ onToggleNavbar }: { onToggleNavbar: () => void }) {
  return (
    <header className="fixed top-0 left-0 w-full bg-carbon text-white shadow-lg z-50 flex items-center justify-between px-6 py-4">
      <h1 className="text-xl font-bold text-orchid font-futuristic">NYSOLA AI OPS</h1>

      <div className="flex items-center space-x-4">
        {/* ✅ Hanya render NotificationDropdown, tombol lonceng sudah di dalamnya */}
        <NotificationDropdown />

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