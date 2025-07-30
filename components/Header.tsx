// components/Header.tsx
import { useState } from 'react';
import NotificationDropdown from './NotificationDropdown';
// Hapus saja Bar3Icon, ganti manual

export default function Header({ onToggleNavbar }: { onToggleNavbar: () => void }) {
  return (
    <header className="w-full flex items-center justify-between px-4 py-3 bg-carbon text-white shadow-md fixed top-0 left-0 z-50">
      <div className="flex items-center gap-4">
        <button onClick={onToggleNavbar} className="text-2xl hover:text-cyan transition">
         ☰
         </button>
        <h1 className="text-xl font-bold text-orchid font-futuristic">Nysola</h1>
      </div>

      <NotificationDropdown />
    </header>
  );
}