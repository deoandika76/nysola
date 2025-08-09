// components/BalanceChart.tsx
import { useEffect, useState } from 'react';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { JsonRpcProvider, formatEther } from 'ethers';
import { fetchWallets } from '@/firebase';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

export default function BalanceChart() {
  const [balances, setBalances] = useState<{ address: string; balance: number }[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const wallets = await fetchWallets();
        const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_SEPOLIA_RPC!);

        const results = await Promise.all(
          wallets.map(async (w) => {
            const balanceBN = await provider.getBalance(w.address);
            return { address: w.address, balance: parseFloat(formatEther(balanceBN)) };
          }),
        );

        setBalances(results);
        setTotalBalance(results.reduce((acc, curr) => acc + curr.balance, 0));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const chartData = {
    labels: balances.map((w) => `${w.address.slice(0, 6)}...${w.address.slice(-4)}`),
    datasets: [
      {
        label: 'ETH Balance',
        data: balances.map((w) => Number(w.balance.toFixed(6))),
        backgroundColor: 'rgba(56,232,225,0.85)',
        borderRadius: 10,
        barThickness: 30,
        maxBarThickness: 36,
      },
    ],
  };

  const options = {
    responsive: true,
    animation: { duration: 650, easing: 'easeOutCubic' },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (items: any[]) => `Wallet ${items[0].label}`,
          label: (ctx: any) => `${ctx.dataset.label}: ${Number(ctx.parsed.y).toFixed(6)} ETH`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#d9faff', maxRotation: 30, minRotation: 0 },
        grid: { display: false },
      },
      y: {
        ticks: { color: '#d9faff' },
        grid: { color: 'rgba(255,255,255,0.06)' },
      },
    },
  } as const;

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-violet-700/40 rounded-2xl p-5 shadow-[0_0_60px_-20px_rgba(218,68,255,0.35)]">
      <h2 className="text-xl font-bold text-amber-300 mb-2">💰 Wallet Balance Chart (ETH)</h2>
      <p className="text-white/90 mb-4">
        Total Balance: <span className="text-cyan-300 font-semibold">{totalBalance.toFixed(6)} ETH</span>
      </p>
      {loading ? (
        <p className="text-gray-300">Loading balances…</p>
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </div>
  );
}