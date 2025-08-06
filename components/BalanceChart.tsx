// components/BalanceChart.tsx
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { fetchWallets } from '../firebase';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function BalanceChart() {
  const [labels, setLabels] = useState<string[]>([]);
  const [balances, setBalances] = useState<number[]>([]);

  useEffect(() => {
    const getBalances = async () => {
      try {
        const wallets = await fetchWallets();
        const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_SEPOLIA_RPC);

        const balancesPromises = wallets.map(async (wallet: any) => {
          const balanceBigInt = await provider.getBalance(wallet.address);
          const balanceEth = parseFloat(ethers.formatEther(balanceBigInt));
          return {
            label: wallet.address.slice(0, 6) + '...' + wallet.address.slice(-4),
            balance: balanceEth,
          };
        });

        const results = await Promise.all(balancesPromises);
        setLabels(results.map((r) => r.label));
        setBalances(results.map((r) => r.balance));
      } catch (err) {
        console.error('Error fetching balances:', err);
      }
    };

    getBalances();
  }, []);

  const data = {
    labels,
    datasets: [
      {
        label: 'ETH Balance',
        data: balances,
        backgroundColor: '#00ffff88',
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: '#ccc' },
      },
      x: {
        ticks: { color: '#ccc' },
      },
    },
  };

  return (
    <div className="bg-[#1e1e1eaa] p-6 rounded-xl shadow-lg w-full max-w-4xl mx-auto mt-10 backdrop-blur-md border border-cyan-400">
      <h2 className="text-xl font-bold text-cyan mb-4">💰 Wallet Balance Chart (ETH)</h2>
      <Bar data={data} options={options} />
    </div>
  );
}