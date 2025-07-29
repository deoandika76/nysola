import Link from 'next/link';

const menuItems = [
  { name: 'Dashboard', href: '/' },
  { name: 'Wallets', href: '/wallets' },
  { name: 'Tasks', href: '/tasks' },
  { name: 'Auto Task', href: '/auto' }, // ✅ Tambahan Auto Task
  { name: 'Schedule TX', href: '/schedule' },
  { name: 'Check Schedule', href: '/check' }
  { name: 'Opportunities', href: '/opportunities' },
  { name: 'Notifications', href: '/notifications' },
  { name: 'Settings', href: '/settings' },
];

export default function Sidebar() {
  return (
    <div className="w-full md:w-64 md:h-screen bg-carbon text-white md:fixed top-0 left-0 shadow-lg p-4 md:p-6 space-y-4 md:space-y-6 z-10">
      <h1 className="text-2xl font-bold text-orchid">Nysola</h1>
      <ul className="space-y-2 md:space-y-3">
        {menuItems.map((item) => (
          <li key={item.name}>
            <Link href={item.href}>
              <span className="block hover:text-cyan transition">{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}