// components/Navbar.tsx
import Link from 'next/link';
import { useState } from 'react';
import GodEyeModal from './GodEyeModal';

export default function Navbar({ isOpen }: { isOpen: boolean }) {
  const [modalOpen, setModalOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed top-20 left-0 w-full max-w-xs bg-carbon border-r border-gray-800 shadow-lg z-40 h-full p-6 text-white overflow-y-auto">
      <h2 className="text-xl font-bold mb-4 text-orchid">🔭 Navigation</h2>
      <ul className="space-y-3">
        <li><Link href="/wallets">Wallets</Link></li>
        <li><Link href="/tasks">Tasks</Link></li>
        <li><Link href="/auto">Auto Task</Link></li>
        <li><Link href="/schedule">Schedule TX</Link></li>
        <li><Link href="/check">Check Schedule</Link></li>
        <li><Link href="/opportunities">Opportunities</Link></li>
        <li><Link href="/hunter">Hunter</Link></li>
        <li><Link href="/tx-history">Tx History</Link></li>
        <li><Link href="/notifications">Notifications</Link></li>
        <li><Link href="/hunters/mission">Hunter Missions</Link></li>
        <li><Link href="/godeye-log">God Eye Log</Link></li>
      </ul>

      {/* 🔥 GOD EYE Button */}
      <div className="mt-6">
        <button
          onClick={() => setModalOpen(true)}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-2 px-4 rounded"
        >
          👁️‍🔥 Activate GOD EYE
        </button>
      </div>

      {/* 🔮 GOD EYE Modal */}
      <GodEyeModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}