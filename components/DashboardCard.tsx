// components/DashboardCard.tsx
interface DashboardCardProps {
  title: string;
  value: string;
  icon: string;
  color?: string;
}

export default function DashboardCard({ title, value, icon, color = 'purple-600' }: DashboardCardProps) {
  return (
    <div className={`bg-${color} bg-opacity-20 border border-${color} p-4 rounded-xl shadow-md`}>
      <div className="text-3xl">{icon}</div>
      <div className="text-xl font-bold text-white mt-2">{value}</div>
      <div className="text-sm text-gray-400">{title}</div>
    </div>
  );
}