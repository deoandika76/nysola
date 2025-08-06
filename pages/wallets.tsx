// pages/wallets.tsx
import { useEffect, useState } from 'react';
import { fetchWallets, fetchTxHistory } from '../firebase';
import WalletList from '../components/WalletList';
import FullLayout from '../components/FullLayout';
import { ethers } from 'ethers';

type Wallet = {
  address: string;
  privateKey: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
};

type Transaction = {
  walletAddress: string;
  txHash: string;
  status: 'success' | 'failed';
};

export default function WalletsPage() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [txHistory, setTxHistory] = useState<Transaction[]>([]);
  const [balances, setBalances] = useState<{ address: string; balance: number }[]>([]);
  const [ethPrice, setEthPrice] = useState<number>(0);
  const [generateCount, setGenerateCount] = useState(1);

  useEffect(() => {
    const loadData = async () => {
      const [walletData, txData] = await Promise.all([fetchWallets(), fetchTxHistory()]);
      setWallets(walletData);
      setTxHistory(txData);

      // 🧠 Get balances
      const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_SEPOLIA_RPC);
      const balances = await Promise.all(
        walletData.map(async (w) => {
          const bal = await provider.getBalance(w.address);
          return { address: w.address, balance: parseFloat(ethers.formatEther(bal)) };
        })
      );
      setBalances(balances);

      // 🧠 Get ETH price
      const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
      const data = await res.json();
      setEthPrice(data.ethereum.usd);
    };

    loadData();
  }, []);

  const totalEth = balances.reduce((acc, b) => acc + b.balance, 0);
  const totalUsd = totalEth * ethPrice;
  const totalTx = txHistory.length;
  const totalTasks = 0; // Placeholder bro, nanti kita isi dari fitur Tasks per wallet

  const handleGenerateWallets = async () => {
    for (let i = 0; i < generateCount; i++) {
      const wallet = ethers.Wallet.createRandom();
      await fetch('/api/saveWallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: wallet.address,
          privateKey: wallet.privateKey,
        }),
      });
    }
    window.location.reload();
  };

  return (
    <FullLayout title="Wallets">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-teal-400">🧾 Wallet Management</h1>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={generateCount}
            onChange={(e) => setGenerateCount(Number(e.target.value))}
            className="bg-black border border-gray-500 px-2 py-1 w-16 text-center rounded"
            min={1}
            max={100}
          />
          <button
            onClick={handleGenerateWallets}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-white font-bold"
          >
            ⚡ Generate {generateCount} Wallet
          </button>
        </div>
      </div>

      <div className="grid gap-4 mb-10 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="💰 Total ETH" value={`${totalEth.toFixed(4)} ETH`} />
        <StatCard label="💵 Estimated USD" value={`$${totalUsd.toFixed(2)}`} />
        <StatCard label="🧾 Total Transactions" value={totalTx.toString()} />
        <StatCard label="✅ Tasks Completed" value={totalTasks.toString()} />
      </div>

      <WalletList
        wallets={wallets.map((w) => ({
          address: w.address,
          privateKey: w.privateKey,
          createdAt: new Date(w.createdAt?.seconds * 1000).toLocaleString('id-ID'),
        }))}
      />
    </FullLayout>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#111] border border-purple-500 p-4 rounded text-center">
      <p className="text-gray-300 text-sm">{label}</p>
      <p className="text-2xl font-bold text-purple-300 mt-1">{value}</p>
    </div>
  );
}