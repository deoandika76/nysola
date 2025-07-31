//heh
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
      <nav className="p-4 space-y-2">
        <Link href="/wallets" className="block hover:text-orchid">Wallets</Link>
        <Link href="/tasks" className="block hover:text-orchid">Tasks</Link>
        <Link href="/auto" className="block hover:text-orchid">Auto Task</Link>
        <Link href="/schedule" className="block hover:text-orchid">Schedule TX</Link>
        <Link href="/check" className="block hover:text-orchid">Check Schedule</Link>
        <Link href="/opportunities" className="block hover:text-orchid">Opportunities</Link>
        <Link href="/hunter" className="block hover:text-orchid">Hunter</Link>
        <Link href="/tx-history" className="block hover:text-orchid">Tx History</Link>
        <Link href="/notifications" className="block hover:text-orchid">Notifications</Link>
        <Link href="/hunters/mission" className="block hover:text-orchid">Hunter Missions</Link>

        {/* 👁️‍🔥 GOD EYE */}
        <button
          onClick={() => {
            const modal = document.getElementById('godeye-modal');
            if (modal) modal.classList.remove('hidden');
          }}
          className="w-full mt-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 rounded text-sm font-bold hover:from-purple-700 hover:to-pink-600 transition"
        >
          👁️‍🔥 Activate GOD EYE
        </button>
      </nav>
    </div>
  );
}