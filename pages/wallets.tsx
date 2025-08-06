// pages/wallets.tsx
import { useEffect, useState } from 'react';
import { fetchWallets, fetchTxHistory } from '../firebase';
import WalletList from '../components/WalletList';
import ExportWalletsButton from '../components/ExportWalletsButton';
import FullLayout from '../components/FullLayout';

type Wallet = {
  address: string;
  privateKey: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
};

type TxItem = {
  walletAddress: string;
  txHash: string;
  status: 'success' | 'failed';
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
};

export default function WalletsPage() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [txHistory, setTxHistory] = useState<TxItem[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [walletData, txData] = await Promise.all([fetchWallets(), fetchTxHistory()]);
      setWallets(walletData);
      setTxHistory(txData);
    };
    loadData();
  }, []);

  return (
    <FullLayout title="Wallets | Nysola">
      <div className="text-white">
        <h1 className="text-3xl font-bold mb-6 text-purple-400">🧾 Wallet Management</h1>

        {/* ✅ Tambahkan UI analytics, chart, dsb di atas jika diperlukan */}

        <WalletList wallets={wallets.map((w) => ({
          address: w.address,
          privateKey: w.privateKey,
          createdAt: new Date(w.createdAt.seconds * 1000).toLocaleString('id-ID')
        }))} />

        <div className="mt-6">
          <ExportWalletsButton />
        </div>
      </div>
    </FullLayout>
  );
}