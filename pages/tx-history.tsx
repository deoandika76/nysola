// pages/tx-history.tsx
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import TxCard from '../components/TxCard';
import Layout from '../components/Layout';

interface Tx {
  from: string;
  to: string;
  value: string;
  txHash: string;
  createdAt: { seconds: number };
}

export default function TxHistory() {
  const [txs, setTxs] = useState<Tx[]>([]);

  useEffect(() => {
    const fetchTxs = async () => {
      const snapshot = await getDocs(collection(db, 'txHistory'));
      const data = snapshot.docs.map((doc) => doc.data() as Tx);
      setTxs(data);
    };

    fetchTxs();
  }, []);

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6 text-purple-500">📜 Transaction History</h1>
      <div className="grid gap-4">
        {txs.length === 0 && <p className="text-gray-400">Belum ada transaksi tercatat.</p>}
        {txs.map((tx, idx) => (
          <TxCard
            key={idx}
            from={tx.from}
            to={tx.to}
            value={tx.value}
            txHash={tx.txHash}
            createdAt={new Date(tx.createdAt.seconds * 1000).toLocaleString('id-ID')}
          />
        ))}
      </div>
    </Layout>
  );
}