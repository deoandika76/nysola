import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement, Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

type Props = {
  icon?: React.ReactNode;
  label: string;
  value: string | number;
  delta?: number;              // % naik/turun (24h)
  series?: number[];           // data sparkline kecil
};

export default function KPIStat({ icon, label, value, delta, series = [] }: Props) {
  const color = delta === undefined ? 'text-gray-300'
    : delta >= 0 ? 'text-emerald-400' : 'text-rose-400';

  const data = useMemo(() => ({
    labels: series.map((_, i) => i.toString()),
    datasets: [{
      data: series,
      borderWidth: 2,
      tension: 0.4,
      pointRadius: 0,
      borderColor: 'rgba(56,232,225,1)',     // cyan
      backgroundColor: 'rgba(56,232,225,0.15)',
      fill: true,
    }],
  }), [series]);

  const options = useMemo(() => ({
    responsive: true,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: {
      x: { display: false, grid: { display: false } },
      y: { display: false, grid: { display: false } },
    },
  }), []);

  return (
    <div className="relative overflow-hidden rounded-xl border border-violet-700/40 bg-white/5 backdrop-blur-xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="shrink-0 text-orchid">{icon}</div>
          <div>
            <p className="text-sm text-gray-300">{label}</p>
            <p className="text-2xl font-extrabold text-white tracking-tight">
              {value}
            </p>
          </div>
        </div>
        {delta !== undefined && (
          <div className={`text-xs font-semibold ${color}`}>
            {delta >= 0 ? '▲' : '▼'} {Math.abs(delta).toFixed(1)}%
          </div>
        )}
      </div>

      {/* sparkline */}
      {series.length > 0 && (
        <div className="absolute inset-x-0 bottom-0 opacity-80">
          <div className="h-14">
            <Line data={data} options={options as any} />
          </div>
        </div>
      )}
    </div>
  );
}