// components/DashboardCard.tsx
type Props = {
  title: string;
  value: string;
  icon: string;
  color?: string;
  subtitle?: string;
  // trend (opsional)
  trendPct?: number;       // mis. 12.5  => +12.5%
  trendLabel?: string;     // mis. "vs 1h sebelumnya"
  compact?: boolean;
};

export default function DashboardCard({
  title,
  value,
  icon,
  color,
  subtitle,
  trendPct,
  trendLabel,
  compact,
}: Props) {
  const up = (trendPct ?? 0) >= 0;
  const trendText =
    typeof trendPct === 'number'
      ? `${up ? '▲' : '▼'} ${Math.abs(trendPct).toFixed(1)}%`
      : null;

  return (
    <div
      className={`rounded-xl border border-violet-600/40 bg-white/5 backdrop-blur-xl shadow-[0_0_60px_-20px_rgba(218,68,255,0.35)]
        ${compact ? 'p-4 w-48' : 'p-6 w-60'}`}
    >
      <div className={`${compact ? 'text-2xl' : 'text-3xl'} mb-2`}>{icon}</div>
      <h3 className={`font-bold ${compact ? 'text-lg' : 'text-xl'} ${color || 'text-cyan'}`}>
        {value}
      </h3>
      <p className={`text-gray-400 ${compact ? 'text-[11px]' : 'text-sm'}`}>{title}</p>

      {subtitle && !compact && (
        <p className="text-[11px] text-cyan/80 mt-1">{subtitle}</p>
      )}

      {trendText && (
        <div
          className={`mt-2 inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold
          ${up ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'}`}
        >
          {trendText}
          {trendLabel && <span className="ml-1 opacity-70">{trendLabel}</span>}
        </div>
      )}
    </div>
  );
}