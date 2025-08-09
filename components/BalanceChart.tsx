// components/BalanceChart.tsx
import { useEffect, useState } from 'react';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { JsonRpcProvider, formatEther } from 'ethers';
import { fetchWallets } from '@/firebase';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function BalanceChart() {
  const [balances, setBalances] = useState<{ address: string; balance: number }[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    (async () => {
      const wallets = await fetchWallets();
      const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_SEPOLIA_RPC!);
      const rows = await Promise.all(
        wallets.map(async (w: any) => {
          const bn = await provider.getBalance(w.address);
          return { address: w.address, balance: Number(parseFloat(formatEther(bn)).toFixed(6)) };
        })
      );
      setBalances(rows);
      setTotal(rows.reduce((a, b) => a + b.balance, 0));
    })();
  }, []);

  const data = {
    labels: balances.map((w) => `${w.address.slice(0, 6)}…${w.address.slice(-4)}`),
    datasets: [
      { label: 'ETH Balance', data: balances.map((w) => w.balance), backgroundColor: '#2ee9ff' },
    ],
  };

  const options: any = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, ticks: { color: '#fff' } },
      x: { ticks: { color: '#fff' } },
    },
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-violet-700/40 rounded-2xl p-5 shadow-[0_0_60px_-20px_rgba(218,68,255,0.35)]">
      <h2 className="text-xl font-bold text-amber-400 mb-2">💰 Wallet Balance (ETH)</h2>
      <p className="text-white mb-4">
        Total Balance: <span className="text-cyan-300 font-semibold">{total.toFixed(6)} ETH</span>
      </p>
      <Bar data={data} options={options} />
    </div>
  );
}