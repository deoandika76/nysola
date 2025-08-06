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

  useEffect(() => {
    const fetchBalances = async () => {
      const wallets = await fetchWallets();
      const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_SEPOLIA_RPC!);

      const results = await Promise.all(wallets.map(async (w) => {
        const balanceBN = await provider.getBalance(w.address);
        return {
          address: w.address,
          balance: parseFloat(formatEther(balanceBN)),
        };
      }));

      setBalances(results);
      setTotalBalance(results.reduce((acc, curr) => acc + curr.balance, 0));
    };

    fetchBalances();
  }, []);

  const chartData = {
    labels: balances.map((w) => `${w.address.slice(0, 6)}...${w.address.slice(-4)}`),
    datasets: [
      {
        label: 'ETH Balance',
        data: balances.map((w) => w.balance),
        backgroundColor: '#00FFFF',
      },
    ],
  };

  return (
    <div className="bg-[#0f0f0f] p-6 rounded-lg shadow-md border border-gray-700 w-full max-w-3xl mx-auto mt-12">
      <h2 className="text-xl font-bold text-amber-400 mb-2">💰 Wallet Balance Chart (ETH)</h2>
      <p className="text-white mb-4">Total Balance: <span className="text-cyan-400 font-semibold">{totalBalance.toFixed(4)} ETH</span></p>
      <Bar data={chartData} options={{
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => `ETH Balance: ${context.parsed.y}`,
            },
          },
        },
        responsive: true,
        scales: {
          y: {
            ticks: {
              color: '#fff',
            },
          },
          x: {
            ticks: {
              color: '#fff',
            },
          },
        },
      }} />
    </div>
  );
}