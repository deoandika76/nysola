// components/Navbar.tsx
// BENER NI BRO
import Link from 'next/link';

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
];

export default function Navbar({ isOpen }: { isOpen: boolean }) {
  return (
    <aside
      className={`fixed top-16 right-0 w-64 bg-[#1a1a1a] border-l border-gray-700 p-6 text-white h-full transition-transform z-40 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <h2 className="text-2xl font-bold text-orchid mb-6">🔭 Navigation</h2>
      <ul className="space-y-4">
        {menuItems.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="hover:text-cyan block">
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}