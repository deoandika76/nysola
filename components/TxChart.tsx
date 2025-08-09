// components/TxChart.tsx
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function TxChart({
  success,
  failed,
  compact,
}: {
  success: number;
  failed: number;
  compact?: boolean;
}) {
  const data = {
    labels: ['Success', 'Failed'],
    datasets: [
      {
        label: 'Transaction Status',
        data: [success, failed],
        backgroundColor: ['#00FFFF', '#FF4D4D'],
        borderRadius: 8,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    animation: { duration: 600, easing: 'easeOutQuart' },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: '#cbd5e1' }, // slategrey
        grid: { color: 'rgba(148,163,184,0.15)' },
      },
      x: {
        ticks: { color: '#cbd5e1' },
        grid: { display: false },
      },
    },
  };

  return (
    <div
      className={`bg-white/5 backdrop-blur-xl border border-violet-700/40 rounded-2xl shadow-[0_0_60px_-20px_rgba(218,68,255,0.35)]
      ${compact ? 'p-4' : 'p-5'}`}
    >
      <h2 className="text-xl font-bold text-cyan mb-4">📊 Transaction Chart</h2>
      <Bar data={data} options={options} />
    </div>
  );
}