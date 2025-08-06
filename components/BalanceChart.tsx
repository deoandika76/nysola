// components/BalanceChart.tsx
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { JsonRpcProvider } from 'ethers';
import { fetchWallets } from '../firebase';

const BalanceChart = () => {
  const [labels, setLabels] = useState<string[]>([]);
  const [balances, setBalances] = useState<number[]>([]);

  useEffect(() => {
    const fetchBalances = async () => {
      const wallets = await fetchWallets();
      const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_SEPOLIA_RPC);

      const newLabels: string[] = [];
      const newBalances: number[] = [];

      for (const wallet of wallets) {
        const address = wallet.address;
        const balance = await provider.getBalance(address);
        const ethBalance = Number(balance.toString()) / 1e18;

        newLabels.push(address.slice(0, 6) + '...' + address.slice(-4));
        newBalances.push(ethBalance);
      }

      setLabels(newLabels);
      setBalances(newBalances);
    };

    fetchBalances();
  }, []);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'ETH Balance',
        data: balances,
        backgroundColor: 'rgba(0, 255, 255, 0.8)', // transparan neon
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `ETH Balance: ${context.parsed.y.toFixed(4)}`;
          },
        },
      },
      title: {
        display: true,
        text: '💰 Wallet Balance Chart (ETH)',
        color: '#00ffff',
        font: { size: 18 },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#fff',
        },
      },
      y: {
        ticks: {
          color: '#fff',
        },
      },
    },
  };

  return (
    <div className="bg-[#111] p-4 rounded-lg w-full md:w-[600px] mx-auto border border-white/20">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BalanceChart;