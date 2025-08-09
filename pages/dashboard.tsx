// pages/dashboard.tsx
import { useEffect, useState } from 'react';
import FullLayout from '../components/FullLayout';
import DashboardCard from '../components/DashboardCard';
import { listenToTxHistory } from '../firebase';
import TxChart from '../components/TxChart';
import BalanceChart from '../components/BalanceChart';

type Tx = { status: 'success' | 'failed'; timestamp: { seconds: number } };

export default function Dashboard() {
  const [txs, setTxs] = useState<Tx[]>([]);
  const successCount = txs.filter((t) => t.status === 'success').length;
  const failedCount = txs.filter((t) => t.status === 'failed').length;

  useEffect(() => {
    const unsub = listenToTxHistory((arr: any[]) => {
      // pastikan minimal field status & timestamp
      setTxs(
        arr.map((d: any) => ({
          status: d.status,
          timestamp: d.timestamp ?? { seconds: Math.floor(Date.now() / 1000) },
        }))
      );
    });
    return () => unsub();
  }, []);

  return (
    <FullLayout title="Dashboard - Nysola">
      <h1 className="text-4xl font-bold mb-8 text-cyan text-center">📊 Dashboard Analytics</h1>

      <div className="flex flex-wrap gap-6 justify-center mb-10">
        <DashboardCard title="Total Transactions" value={String(txs.length)} icon="📦" />
        <DashboardCard title="Success" value={String(successCount)} icon="✅" color="text-green-400" />
        <DashboardCard title="Failed" value={String(failedCount)} icon="❌" color="text-red-500" />
      </div>

      <div className="mb-10">
        <TxChart txs={txs} />
      </div>

      <BalanceChart />
    </FullLayout>
  );
}