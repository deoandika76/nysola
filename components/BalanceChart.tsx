// components/BalanceChart.tsx/
'use client';

import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { JsonRpcProvider, formatEther } from 'ethers';
import { fetchWallets } from '@/firebase';

ChartJS.register(ArcElement, Tooltip, Legend);

type Slice = { label: string; value: number };

export default function BalanceChart() {
  const [slices, setSlices] = useState<Slice[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    (async () => {
      const wallets = await fetchWallets();
      const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_SEPOLIA_RPC!);

      const rows: Slice[] = [];
      for (const w of wallets) {
        const bal = await provider.getBalance(w.address);
        const eth = parseFloat(formatEther(bal));
        rows.push({
          label: `${w.address.slice(0, 6)}…${w.address.slice(-4)}`,
          value: eth,
        });
      }

      rows.sort((a, b) => b.value - a.value);
      setSlices(rows);
      setTotal(rows.reduce((a, c) => a + c.value, 0));
    })();
  }, []);

  const data = {
    labels: slices.map(s => s.label),
    datasets: [
      {
        data: slices.map(s => s.value),
        backgroundColor: [
          '#38E8E1', '#DA44FF', '#7CF7A0', '#FFD36E',
          '#FF8AAE', '#7AB8FF', '#C6A7FF', '#7EE3FF',
        ],
        hoverOffset: 6,
        borderWidth: 0,
      },
    ],
  };

  const options: any = {
    cutout: '65%',
    plugins: {
      legend: { position: 'right', labels: { color: '#eaeaea', boxWidth: 14 } },
      tooltip: {
        callbacks: {
          label: (ctx: any) => `${ctx.label}: ${ctx.parsed} ETH`,
        },
      },
    },
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-violet-700/40 rounded-2xl p-5 shadow-[0_0_60px_-20px_rgba(56,232,225,0.35)]">
      <div className="flex items-start justify-between mb-2">
        <h2 className="text-xl font-bold text-amber-300">💰 Wallet Balance (ETH)</h2>
        <span className="text-xs text-gray-300">Realtime (read‑only)</span>
      </div>
      <p className="text-white mb-4">
        Total Balance: <span className="text-cyan-300 font-semibold">{total.toFixed(6)} ETH</span>
      </p>
      <div style={{ height: 280 }}>
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}