// components/BalanceChart.tsx
import { useEffect, useState } from 'react';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, ChartOptions } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { JsonRpcProvider, formatEther } from 'ethers';
import { fetchWallets } from '@/firebase';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

export default function BalanceChart({ refreshMs = 60000, compact }: { refreshMs?: number; compact?: boolean; }) {
  const [balances, setBalances] = useState<{ address: string; balance: number }[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);

  const load = async () => {
    try {
      const wallets = await fetchWallets();
      const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_SEPOLIA_RPC!);

      const results = await Promise.all(
        wallets.map(async (w) => {
          const bn = await provider.getBalance(w.address);
          return { address: w.address, balance: parseFloat(formatEther(bn)) };
        })
      );

      setBalances(results);
      setTotalBalance(results.reduce((a, b) => a + b.balance, 0));
    } catch {
      // swallow to avoid build errors on server
    }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, refreshMs);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshMs]);

  const chartData = {
    labels: balances.map((w) => `${w.address.slice(0, 6)}...${w.address.slice(-4)}`),
    datasets: [
      {
        label: 'ETH Balance',
        data: balances.map((w) => w.balance),
        backgroundColor: '#00FFFF',
        borderRadius: 6,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    animation: { duration: 700, easing: 'easeOutQuart' },
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx) => `ETH Balance: ${ctx.parsed.y}`,
        },
      },
      legend: { display: false },
    },
    scales: {
      y: {
        ticks: { color: '#fff' },
        grid: { color: 'rgba(148,163,184,0.15)' },
      },
      x: {
        ticks: { color: '#fff' },
        grid: { display: false },
      },
    },
  };

  return (
    <div
      className={`rounded-2xl border border-violet-700/40 bg-white/5 backdrop-blur-xl shadow-[0_0_60px_-20px_rgba(56,232,225,0.25)]
      ${compact ? 'p-4' : 'p-6'} mt-8`}
    >
      <div className="flex items-baseline justify-between">
        <h2 className="text-xl font-bold text-amber-400 mb-2">💰 Wallet Balance Chart (ETH)</h2>
        <span className="text-[11px] opacity-70">Realtime (read‑only)</span>
      </div>
      <p className="text-white mb-4">
        Total Balance:{' '}
        <span className="text-cyan-400 font-semibold">{totalBalance.toFixed(6)} ETH</span>
      </p>
      <Bar data={chartData} options={options} />
    </div>
  );
}