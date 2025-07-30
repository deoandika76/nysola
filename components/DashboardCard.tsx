// components/DashboardCard.tsx
// cuma iseng wkwk
type Props = {
  title: string;
  value: string;
  icon: string;
  color?: string;
};

export default function DashboardCard({ title, value, icon, color }: Props) {
  return (
    <div className="bg-[#1a1a1a] border border-gray-700 p-6 rounded-xl text-center shadow-md w-60">
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className={`text-xl font-bold mb-1 ${color || 'text-cyan'}`}>{value}</h3>
      <p className="text-gray-400 text-sm">{title}</p>
    </div>
  );
}