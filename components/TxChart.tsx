// components/TxChart.tsx
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function TxChart({ success, failed }: { success: number; failed: number }) {
  const data = {
    labels: ['Success', 'Failed'],
    datasets: [
      {
        label: 'Transaction Status',
        data: [success, failed],
        backgroundColor: ['#00ffff', '#ff4d4d'],
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true, ticks: { color: '#ccc' } },
      x: { ticks: { color: '#ccc' } },
    },
  };

  return (
    <div className="bg-carbon p-4 rounded-xl shadow-lg w-full max-w-xl mx-auto">
      <h2 className="text-xl font-bold text-cyan mb-4">📊 Transaction Chart</h2>
      <Bar data={data} options={options} />
    </div>
  );
}
