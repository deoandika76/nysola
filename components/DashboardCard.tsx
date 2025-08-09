// components/DashboardCard.tsx
type Props = {
  title: string;
  value: string;
  icon: string;
  color?: string;
};

export default function DashboardCard({ title, value, icon, color }: Props) {
  return (
    <div className="bg-white/6 backdrop-blur-xl border border-violet-700/40 p-6 rounded-2xl text-center shadow-[0_0_60px_-20px_rgba(218,68,255,0.35)]">
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className={`text-2xl font-extrabold mb-1 tracking-tight ${color || 'text-cyan-300'}`}>
        {value}
      </h3>
      <p className="text-gray-300 text-sm">{title}</p>
    </div>
  );
}