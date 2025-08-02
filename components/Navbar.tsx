// components/Navbar.tsx/
import Link from 'next/link';
import { useState } from 'react';
import GodEyeModal from './GodEyeModal';

interface NavbarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Navbar({ isOpen, onClose }: NavbarProps) {
  const [modalOpen, setModalOpen] = useState(false);

  if (!isOpen) return null;

  const menuItems = [
    { name: 'Wallets', href: '/wallets' },
    { name: 'Tasks', href: '/tasks' },
    { name: 'Auto Task', href: '/auto' },
    { name: 'Schedule TX', href: '/schedule' },
    { name: 'Check Schedule', href: '/check' },
    { name: 'Opportunities', href: '/opportunities' },
    { name: 'Hunter', href: '/hunter' },
    { name: 'Tx History', href: '/tx-history' },
    { name: 'Notifications', href: '/notifications' },
    { name: 'Hunter Missions', href: '/hunters/mission' },
    { name: 'God Eye Log', href: '/godeye-log' },
    { name: 'Settings', href: '/settings' },
  ];

  return (
    <div className="fixed top-20 left-0 w-full max-w-xs bg-carbon border-r border-gray-800 shadow-lg z-40 h-full p-6 text-white overflow-y-auto">
      <h2 className="text-xl font-bold mb-4 text-orchid">🔭 Navigation</h2>
      <ul className="space-y-3">
        {menuItems.map((item) => (
          <li key={item.name}>
            <Link href={item.href} onClick={onClose}>
              {item.name}
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <button
          onClick={() => setModalOpen(true)}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-2 px-4 rounded"
        >
          👁️‍🔥 Activate GOD EYE
        </button>
      </div>

      <GodEyeModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}