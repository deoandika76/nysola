// components/TxChart.tsx
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export type Tx = {
  status: 'success' | 'failed';
  timestamp: { seconds: number };
};

function toDateLabel(sec: number) {
  const d = new Date(sec * 1000);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export default function TxChart({ txs }: { txs: Tx[] }) {
  // agregasi per-hari
  const bucket = new Map<string, { success: number; failed: number }>();
  txs.forEach((t) => {
    const key = toDateLabel(t.timestamp.seconds || 0);
    if (!bucket.has(key)) bucket.set(key, { success: 0, failed: 0 });
    const cur = bucket.get(key)!;
    if (t.status === 'success') cur.success += 1;
    else cur.failed += 1;
  });

  // urutkan label waktu
  const labels = Array.from(bucket.keys()).sort();
  // fallback kalau kosong biar chart.js nggak error
  const safeLabels = labels.length ? labels : [toDateLabel(Math.floor(Date.now() / 1000))];

  const successData = safeLabels.map((k) => bucket.get(k)?.success ?? 0);
  const failedData = safeLabels.map((k) => bucket.get(k)?.failed ?? 0);

  const data = {
    labels: safeLabels,
    datasets: [
      {
        label: 'Success',
        data: successData,
        borderColor: '#2ee9ff',
        backgroundColor: '#2ee9ff20',
        pointRadius: 2,
        tension: 0.35,
      },
      {
        label: 'Failed',
        data: failedData,
        borderColor: '#ff6767',
        backgroundColor: '#ff676720',
        pointRadius: 2,
        tension: 0.35,
      },
    ],
  };

  // opsi diketatin biar nggak nabrak typing yang rewel
  const options: any = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { intersect: false, mode: 'index' },
    },
    scales: {
      x: { ticks: { color: '#cfe9ff' }, grid: { display: false } },
      y: { beginAtZero: true, ticks: { color: '#cfe9ff' } },
    },
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-violet-700/40 rounded-2xl p-5 shadow-[0_0_60px_-20px_rgba(218,68,255,0.35)]">
      <h2 className="text-xl font-bold text-cyan mb-4">📈 Transaction Chart</h2>
      <Line data={data} options={options} />
    </div>
  );
}