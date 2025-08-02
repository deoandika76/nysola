// pages/auto.tsx
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import FullLayout from '../components/FullLayout';

type AutoTx = {
  id: string;
  walletAddress: string;
  txHash: string;
  status: 'pending' | 'success' | 'failed';
  createdAt: {
    seconds: number;
  };
};

export default function AutoTaskPage() {
  const [autoTxs, setAutoTxs] = useState<AutoTx[]>([]);

  useEffect(() => {
    const fetchAutoTxs = async () => {
      const snapshot = await getDocs(collection(db, 'autoTasks'));
      const data = snapshot.docs.map((doc) => {
        const raw = doc.data() as Omit<AutoTx, 'id'>;
        return { ...raw, id: doc.id };
      });
      setAutoTxs(data);
    };

    fetchAutoTxs();
  }, []);

  return (
    <FullLayout title="Auto Task">
      <h1 className="text-3xl font-bold mb-6 text-purple-400">🤖 Auto Task History</h1>

      {autoTxs.length === 0 && <p className="text-gray-400">Belum ada transaksi otomatis.</p>}

      <div className="space-y-4">
        {autoTxs.map((tx) => (
          <div
            key={tx.id}
            className={`p-4 rounded shadow border-l-4 ${
              tx.status === 'success'
                ? 'border-green-500 bg-green-900'
                : tx.status === 'failed'
                ? 'border-red-500 bg-red-900'
                : 'border-yellow-500 bg-yellow-900'
            }`}
          >
            <p>👛 Wallet: <span className="text-cyan-300">{tx.walletAddress}</span></p>
            <p>🔗 TX Hash: <a href={`https://sepolia.etherscan.io/tx/${tx.txHash}`} target="_blank" className="text-blue-400 underline">{tx.txHash}</a></p>
            <p>📅 Time: {new Date(tx.createdAt.seconds * 1000).toLocaleString('id-ID')}</p>
            <p>Status: <span className="uppercase">{tx.status}</span></p>
          </div>
        ))}
      </div>
    </FullLayout>
  );
}