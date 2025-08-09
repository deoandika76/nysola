// components/BalanceChart.tsx
import { useEffect, useMemo, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { JsonRpcProvider, formatEther } from 'ethers';
import { fetchWallets } from '@/firebase';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function BalanceChart() {
  const [balances, setBalances] = useState<{ address: string; balance: number }[]>([]);
  const total = useMemo(
    () => balances.reduce((a, b) => a + b.balance, 0),
    [balances]
  );

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const wallets = await fetchWallets();
        const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_SEPOLIA_RPC!);
        const results = await Promise.all(
          wallets.map(async (w) => {
            const bn = await provider.getBalance(w.address);
            return { address: w.address, balance: parseFloat(formatEther(bn)) };
          })
        );
        if (alive) setBalances(results);
      } catch {
        /* ignore */
      }
    })();
    return () => { alive = false; };
  }, []);

  const data = useMemo(() => ({
    labels: balances.map((w) => `${w.address.slice(0, 6)}…${w.address.slice(-4)}`),
    datasets: [{
      data: balances.map((w) => w.balance || 0),
      backgroundColor: ['#28FDE0','#38E8E1','#DA44FF','#7A5FFF','#FF6B6B'],
      borderWidth: 0,
      hoverOffset: 6,
      cutout: '62%',
    }],
  }), [balances]);

  const options = useMemo(() => ({
    plugins: {
      legend: {
        position: 'right' as const,
        labels: { color: '#e6f7ff' as const, boxWidth: 10 },
      },
      tooltip: {
        callbacks: {
          label: (ctx: any) => `${ctx.label}: ${ctx.parsed} ETH`,
        },
      },
    },
    maintainAspectRatio: false,
  }), []);

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-violet-700/40 rounded-2xl p-5 shadow-[0_0_60px_-20px_rgba(218,68,255,0.35)]">
      <div className="flex items-baseline justify-between">
        <h2 className="text-xl font-bold text-amber-300">💰 Wallet Balance (ETH)</h2>
        <span className="text-xs text-white/70">Realtime (read‑only)</span>
      </div>
      <p className="text-white/90 mt-1 mb-4">
        Total Balance: <span className="text-cyan font-semibold">{total.toFixed(6)} ETH</span>
      </p>
      <div style={{ height: 260 }}>
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}