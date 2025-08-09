// components/TxChart.tsx/
'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

type Props = {
  labels: string[];
  successSeries: number[];
  failedSeries: number[];
};

export default function TxChart({ labels, successSeries, failedSeries }: Props) {
  const data = {
    labels,
    datasets: [
      {
        label: 'Success',
        data: successSeries,
        borderColor: '#18ffe4',
        backgroundColor: 'rgba(24,255,228,0.18)',
        pointRadius: 0,
        tension: 0.35,
        fill: true,
      },
      {
        label: 'Failed',
        data: failedSeries,
        borderColor: '#ff5577',
        backgroundColor: 'rgba(255,85,119,0.12)',
        pointRadius: 0,
        tension: 0.35,
        fill: true,
      },
    ],
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, labels: { color: '#d7d7d7' } },
      tooltip: {
        intersect: false,
        mode: 'index',
        callbacks: {
          label: (ctx: any) => `${ctx.dataset.label}: ${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#b8eaff' },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: { color: '#b8eaff' },
        grid: { color: 'rgba(255,255,255,0.07)' },
      },
    },
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-violet-700/40 rounded-2xl p-5 shadow-[0_0_60px_-20px_rgba(218,68,255,0.35)]">
      <h2 className="text-xl font-bold text-cyan mb-4">📈 Transaction Chart</h2>
      <div style={{ height: 280 }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}