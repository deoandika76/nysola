// components/Navbar.tsx
import Link from 'next/link';

export default function Navbar({ isOpen }: { isOpen: boolean }) {
  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-carbon text-white shadow-lg z-40 transform transition-transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-6 border-b border-gray-700 text-xl font-bold text-orchid font-futuristic">
        🛰️ Navigation
      </div>
      <ul className="p-4 space-y-2">
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

        {/* 👁️‍🔥 GOD EYE */}
        <li>
          <button
            onClick={() => {
              const modal = document.getElementById('godeye-modal');
              if (modal) modal.classList.remove('hidden');
            }}
            className="w-full mt-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 rounded text-sm font-bold hover:from-purple-700 hover:to-pink-600 transition"
          >
            👁️‍🔥 Activate GOD EYE
          </button>
        </li>
      </ul>
    </div>
  );
}