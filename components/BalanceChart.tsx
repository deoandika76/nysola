import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { fetchWallets } from '../firebase';
import { ethers } from 'ethers';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function BalanceChart() {
  const [labels, setLabels] = useState<string[]>([]);
  const [balances, setBalances] = useState<number[]>([]);
  const [totalEth, setTotalEth] = useState(0);

  useEffect(() => {
    const fetchBalances = async () => {
      const wallets = await fetchWallets();
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_SEPOLIA_RPC
      );

      const balanceData: number[] = [];
      const labelData: string[] = [];

      let total = 0;

      for (const wallet of wallets) {
        try {
          const bal = await provider.getBalance(wallet.address);
          const eth = parseFloat(ethers.utils.formatEther(bal));
          total += eth;
          balanceData.push(eth);
          labelData.push(`${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`);
        } catch (err) {
          console.error(`Gagal ambil saldo untuk ${wallet.address}`, err);
        }
      }

      setBalances(balanceData);
      setLabels(labelData);
      setTotalEth(total);
    };

    fetchBalances();
  }, []);

  const data = {
    labels,
    datasets: [
      {
        label: 'ETH Balance',
        data: balances,
        backgroundColor: '#00bcd4',
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `ETH Balance: ${context.raw.toFixed(6)}`;
          },
        },
      },
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
    <div className="bg-carbon p-5 rounded-xl shadow-xl w-full max-w-2xl mx-auto border border-white/10">
      <h2 className="text-xl font-bold text-cyan mb-2 flex items-center gap-2">
        💰 Wallet Balance (ETH)
      </h2>
      <p className="text-white text-sm mb-4">Total ETH: {totalEth.toFixed(6)}</p>
      <Bar data={data} options={options} />
    </div>
  );
}