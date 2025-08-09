// components/TxChart.tsx
import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function TxChart({ success, failed }: { success: number; failed: number }) {
  const data = useMemo(() => ({
    labels: ['Success', 'Failed'],
    datasets: [{
      label: 'Transactions',
      data: [success, failed],
      backgroundColor: ['#28FDE0', '#FF6B6B'],
      borderRadius: 8,
      barPercentage: 0.6,
      categoryPercentage: 0.6,
    }],
  }), [success, failed]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 250 },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) => `${ctx.label}: ${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#cfefff' as const },
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255,255,255,0.08)' },
        ticks: { color: '#cfefff' as const },
      },
    },
  }), []);

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-violet-700/40 rounded-2xl p-5 shadow-[0_0_60px_-20px_rgba(218,68,255,0.35)]">
      <h2 className="text-xl font-bold text-cyan mb-4">📈 Transaction Chart</h2>
      <div style={{ height: 260 }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}