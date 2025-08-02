// pages/schedule-tx.tsx
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import FullLayout from '../components/FullLayout';

type ScheduledTx = {
  id: string;
  walletAddress: string;
  to: string;
  value: string;
  scheduledAt: {
    seconds: number;
  };
  status: 'pending' | 'sent' | 'failed';
};

export default function ScheduleTxPage() {
  const [schedules, setSchedules] = useState<ScheduledTx[]>([]);

  useEffect(() => {
    const fetchSchedules = async () => {
      const snapshot = await getDocs(collection(db, 'scheduledTx'));
      const data = snapshot.docs.map((doc) => ({
        ...(doc.data() as Omit<ScheduledTx, 'id'>),
        id: doc.id,
      }));
      setSchedules(data);
    };

    fetchSchedules();
  }, []);

  return (
    <FullLayout title="Schedule TX">
      <h1 className="text-3xl font-bold mb-6 text-yellow-300">📆 Schedule TX</h1>

      {schedules.length === 0 && (
        <p className="text-gray-400">Belum ada transaksi terjadwal.</p>
      )}

      <div className="space-y-4">
        {schedules.map((tx) => (
          <div
            key={tx.id}
            className={`p-4 rounded shadow border-l-4 ${
              tx.status === 'sent'
                ? 'border-green-400 bg-green-900'
                : tx.status === 'failed'
                ? 'border-red-400 bg-red-900'
                : 'border-yellow-400 bg-yellow-900'
            }`}
          >
            <p>👛 Wallet: <span className="text-cyan-300">{tx.walletAddress}</span></p>
            <p>🎯 To: <span className="text-purple-300">{tx.to}</span></p>
            <p>💰 Value: {tx.value} ETH</p>
            <p>🕒 Schedule: {new Date(tx.scheduledAt.seconds * 1000).toLocaleString('id-ID')}</p>
            <p>Status: <span className="uppercase">{tx.status}</span></p>
          </div>
        ))}
      </div>
    </FullLayout>
  );
}