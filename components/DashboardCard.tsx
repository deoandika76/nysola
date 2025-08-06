// components/DashboardCard.tsx
type Props = {
  title: string;
  value: string;
  icon: string;
  color?: string;
};

export default function DashboardCard({ title, value, icon, color }: Props) {
  return (
    <div className="bg-black/50 backdrop-blur-sm border border-purple-600 p-6 rounded-xl text-center shadow-md w-60">
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className={`text-xl font-bold mb-1 ${color || 'text-cyan'}`}>{value}</h3>
      <p className="text-gray-400 text-sm">{title}</p>
    </div>
  );
}