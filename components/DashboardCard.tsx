interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: string;
  color?: string;
}

export default function DashboardCard({
  title,
  value,
  icon,
  color = 'text-cyan'
}: DashboardCardProps) {
  return (
    <div className="bg-carbon p-5 rounded-xl shadow-lg flex flex-col gap-2 w-full max-w-sm">
      <div className={`text-3xl ${color}`}>{icon}</div>
      <h3 className="text-lg text-white font-bold">{title}</h3>
      <p className="text-2xl font-mono text-white">{value}</p>
    </div>
  );
}