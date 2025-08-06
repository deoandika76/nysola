// pages/wallets.tsx
import { useEffect, useState } from 'react';
import { fetchWallets, fetchTxHistory } from '../firebase';
import FullLayout from '@/components/FullLayout';
import axios from 'axios';
import { ethers } from 'ethers';

type Wallet = {
  address: string;
  privateKey: string;
  createdAt: { seconds: number; nanoseconds: number };
};

export default function WalletsPage() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [visibleIndex, setVisibleIndex] = useState<number | null>(null);
  const [txCount, setTxCount] = useState(0);
  const [ethTotal, setEthTotal] = useState(0);
  const [usdTotal, setUsdTotal] = useState(0);
  const [generateCount, setGenerateCount] = useState(1);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [walletData, txData] = await Promise.all([fetchWallets(), fetchTxHistory()]);

    const formatted = walletData.map((doc: any) => ({
      address: doc.address,
      privateKey: doc.privateKey,
      createdAt: doc.createdAt || { seconds: 0, nanoseconds: 0 },
    }));

    setWallets(formatted);
    setTxCount(txData.length);

    // 🧠 Ambil saldo ETH
    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_SEPOLIA_RPC!);
    let totalEth = 0;

    for (const w of formatted) {
      const balance = await provider.getBalance(w.address);
      totalEth += parseFloat(ethers.formatEther(balance));
    }

    setEthTotal(totalEth);

    // 💲 Konversi ke USD (estimasi kasar)
    const rate = 1800; // misalnya 1 ETH = $1800
    setUsdTotal(totalEth * rate);
  };

  const handleGenerate = async () => {
    for (let i = 0; i < generateCount; i++) {
      await axios.post('/api/generate-wallet');
    }
    loadData();
  };

  const toggleVisibility = (index: number) => {
    setVisibleIndex(visibleIndex === index ? null : index);
  };

  return (
    <FullLayout title="Wallet Management">
      <h1 className="text-3xl font-bold mb-6 text-purple-400 flex items-center gap-2">
        🧾 Wallet Management
      </h1>

      {/* Generate */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            value={generateCount}
            onChange={(e) => setGenerateCount(Number(e.target.value))}
            className="bg-black text-white border border-purple-500 px-3 py-1 w-16 rounded text-center"
          />
          <button
            onClick={handleGenerate}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded"
          >
            ⚡ Generate {generateCount} Wallet
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatBox label="Total ETH" value={`${ethTotal.toFixed(4)} ETH`} emoji="💰" />
        <StatBox label="Estimated USD" value={`$${usdTotal.toFixed(2)}`} emoji="💵" />
        <StatBox label="Total Transactions" value={txCount.toString()} emoji="📨" />
        <StatBox label="Tasks Completed" value="0" emoji="✅" />
      </div>

      {/* Wallets */}
      <div className="space-y-4">
        {wallets.map((wallet, index) => (
          <div key={index} className="bg-black border border-purple-500 p-4 rounded text-white">
            <p>🔗 <strong>Address:</strong> {wallet.address}</p>
            <p>
              🔑 <strong>Private Key:</strong>{' '}
              {visibleIndex === index ? wallet.privateKey : '••••••••••••••••••••••'}
              <button
                onClick={() => toggleVisibility(index)}
                className="ml-3 text-sm text-purple-400 underline"
              >
                {visibleIndex === index ? 'Sembunyikan' : 'Tampilkan'}
              </button>
            </p>
            <p>
              🕓 <strong>Dibuat:</strong>{' '}
              {new Date(wallet.createdAt.seconds * 1000).toLocaleString('id-ID')}
            </p>
          </div>
        ))}
      </div>

      {/* Export All */}
      <div className="mt-6">
        <button
          onClick={() => {
            const fileData = JSON.stringify(wallets, null, 2);
            const blob = new Blob([fileData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `wallets-export.json`;
            link.click();
          }}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          ⬇️ Export Semua Wallet
        </button>
      </div>
    </FullLayout>
  );
}

function StatBox({ label, value, emoji }: { label: string; value: string; emoji: string }) {
  return (
    <div className="bg-black border border-purple-600 p-4 rounded text-center">
      <p className="text-md text-gray-300">{emoji} {label}</p>
      <p className="text-2xl font-bold text-purple-300">{value}</p>
    </div>
  );
}