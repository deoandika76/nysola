// components/Navbar.tsx
// HEHE HAHA
import Link from 'next/link';

const menuItems = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Wallets', href: '/wallets' },
  { name: 'Tasks', href: '/tasks' },
  { name: 'Auto Task', href: '/auto' },
  { name: 'Schedule TX', href: '/schedule' },
  { name: 'Check Schedule', href: '/check' },
  { name: 'Opportunities', href: '/opportunities' },
  { name: 'Hunter', href: '/hunter' },
  { name: 'Tx History', href: '/tx-history' },
  { name: 'Settings', href: '/settings' },
];

export default function Navbar({ isOpen }: { isOpen: boolean }) {
  return (
    <aside className={`fixed top-16 left-0 h-full w-64 bg-black text-white z-40 shadow-xl transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-6 space-y-4">
        {menuItems.map((item) => (
          <Link href={item.href} key={item.name} className="block hover:text-cyan">
            {item.name}
          </Link>
        ))}
      </div>
    </aside>
  );
}