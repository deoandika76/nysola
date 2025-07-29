import Link from 'next/link';

const menuItems = [
  { name: 'Dashboard', href: '/' },
  { name: 'Wallets', href: '/wallets' },
  { name: 'Tasks', href: '/tasks' },
  { name: 'Opportunities', href: '/opportunities' },
  { name: 'Notifications', href: '/notifications' },
  { name: 'Settings', href: '/settings' },
];

export default function Sidebar() {
  return (
    <div className="w-64 h-screen fixed left-0 top-0 bg-carbon text-white shadow-lg p-6 space-y-6">
      <h1 className="text-2xl font-bold text-orchid mb-4">Nysola</h1>
      <ul className="space-y-3">
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