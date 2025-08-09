// components/TxChart.tsx
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, Tooltip, Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function TxChart({ success, failed }: { success: number; failed: number }) {
  const data = {
    labels: ['Success', 'Failed'],
    datasets: [
      {
        label: 'Transactions',
        data: [success, failed],
        backgroundColor: ['#38E8E1', '#ff4d4d'],
        borderRadius: 10,
        barThickness: 44,
        maxBarThickness: 46,
      },
    ],
  };

  const options = {
    responsive: true,
    animation: { duration: 600, easing: 'easeOutQuart' },
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
        ticks: { color: '#b8eaff', font: { weight: '600' } },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: { color: '#b8eaff' },
        grid: { color: 'rgba(255,255,255,0.06)' },
      },
    },
  } as const;

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-violet-700/40 rounded-2xl p-5 shadow-[0_0_60px_-20px_rgba(218,68,255,0.35)]">
      <h2 className="text-xl font-bold text-cyan mb-4">📊 Transaction Chart</h2>
      <Bar data={data} options={options} />
    </div>
  );
}