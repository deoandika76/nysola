// components/TxChart.tsx/
import { useMemo } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  LineElement,
  PointElement,
  BarElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  LineElement,
  PointElement,
  BarElement,
  Tooltip,
  Legend,
  Filler
);

type Tx = {
  status: 'success' | 'failed';
  timestamp: { seconds: number } | number; // fleksibel
};

export default function TxChart({ txs }: { txs: Tx[] }) {
  // --- group by day (YYYY-MM-DD)
  const { labels, successSeries, failedSeries, sumSuccess, sumFailed } = useMemo(() => {
    const byDay: Record<string, { s: number; f: number }> = {};
    let sumS = 0;
    let sumF = 0;

    txs.forEach((t) => {
      const secs = typeof t.timestamp === 'number' ? t.timestamp : t.timestamp.seconds;
      const d = new Date(secs * 1000);
      const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
      if (!byDay[key]) byDay[key] = { s: 0, f: 0 };
      if (t.status === 'success') {
        byDay[key].s++;
        sumS++;
      } else {
        byDay[key].f++;
        sumF++;
      }
    });

    const sortedKeys = Object.keys(byDay).sort(); // urut tanggal
    const sSeries = sortedKeys.map((k) => byDay[k].s);
    const fSeries = sortedKeys.map((k) => byDay[k].f);

    return {
      labels: sortedKeys,
      successSeries: sSeries,
      failedSeries: fSeries,
      sumSuccess: sumS,
      sumFailed: sumF,
    };
  }, [txs]);

  // Fallback kalau titik < 2
  const tooFew = labels.length < 2;

  if (tooFew) {
    const data = {
      labels: ['Success', 'Failed'],
      datasets: [
        {
          label: 'Total',
          data: [sumSuccess, sumFailed],
          backgroundColor: ['rgba(0, 255, 255, 0.45)', 'rgba(255, 77, 77, 0.45)'],
          borderColor: ['#00FFFF', '#FF4D4D'],
          borderWidth: 1,
          borderRadius: 10,
        },
      ],
    };
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-violet-700/40 rounded-2xl p-5 shadow-[0_0_60px_-20px_rgba(218,68,255,0.35)]">
        <h2 className="text-xl font-bold text-cyan mb-4">📈 Transaction Chart</h2>
        <Bar
          data={data}
          options={{
            responsive: true,
            animation: { duration: 500 },
            plugins: { legend: { display: false } },
            scales: {
              x: { ticks: { color: '#b8eaff' }, grid: { display: false } },
              y: { beginAtZero: true, ticks: { color: '#b8eaff' }, grid: { color: 'rgba(184,234,255,0.1)' } },
            },
          }}
        />
        <p className="mt-3 text-xs text-gray-300">
          *Data masih 1 hari. Garis akan muncul otomatis kalau sudah ada ≥2 hari data.
        </p>
      </div>
    );
  }

  // Line/area “vibes tradingview”
  const lineData = {
    labels,
    datasets: [
      {
        label: 'Success',
        data: successSeries,
        borderColor: '#28F7F2',
        backgroundColor: 'rgba(40,247,242,0.18)',
        fill: true,
        tension: 0.35,
        pointRadius: 2.5,
        borderWidth: 2,
      },
      {
        label: 'Failed',
        data: failedSeries,
        borderColor: '#FF6B6B',
        backgroundColor: 'rgba(255,107,107,0.16)',
        fill: true,
        tension: 0.35,
        pointRadius: 2.5,
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-violet-700/40 rounded-2xl p-5 shadow-[0_0_60px_-20px_rgba(218,68,255,0.35)]">
      <h2 className="text-xl font-bold text-cyan mb-4">📈 Transaction Chart</h2>
      <Line
        data={lineData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 600, easing: 'easeOutQuart' },
          plugins: {
            legend: { labels: { color: '#b8eaff' } },
            tooltip: {
              callbacks: {
                title(items) {
                  return items?.[0]?.label ?? '';
                },
              },
            },
          },
          scales: {
            x: { ticks: { color: '#b8eaff' }, grid: { display: false } },
            y: { beginAtZero: true, ticks: { color: '#b8eaff' }, grid: { color: 'rgba(184,234,255,0.08)' } },
          },
        }}
        height={280}
      />
    </div>
  );
}