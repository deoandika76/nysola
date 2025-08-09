// pages/dashboard.tsx,
import { useEffect, useState } from 'react';
import FullLayout from '../components/FullLayout';
import DashboardCard from '../components/DashboardCard';
import TxChart, { Tx } from '../components/TxChart';
import BalanceChart from '../components/BalanceChart';
import { listenToTxHistory } from '../firebase';

export default function Dashboard() {
  const [txs, setTxs] = useState<Tx[]>([]);
  const [txCount, setTxCount] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);

  useEffect(() => {
    const unsub = listenToTxHistory((arr: any[]) => {
      // normalisasi ke tipe Tx
      const norm: Tx[] = arr.map((d) => ({
        status: d.status === 'success' ? 'success' : 'failed',
        timestamp: d.timestamp || { seconds: Math.floor(Date.now() / 1000) },
      }));
      setTxs(norm);
      setTxCount(norm.length);
      setSuccessCount(norm.filter((x) => x.status === 'success').length);
      setFailedCount(norm.filter((x) => x.status === 'failed').length);
    });
    return () => unsub();
  }, []);

  return (
    <FullLayout title="Dashboard - Nysola">
      <h1 className="text-4xl font-bold mb-6 text-cyan">📊 Dashboard Analytics</h1>

      <div className="flex flex-wrap gap-6 justify-start mb-8">
        <DashboardCard title="Total Transactions" value={txCount.toString()} icon="📦" />
        <DashboardCard title="Success" value={successCount.toString()} icon="✅" color="text-green-400" />
        <DashboardCard title="Failed" value={failedCount.toString()} icon="❌" color="text-red-500" />
      </div>

      {/* === Tradingview-ish line chart (pakai txs) === */}
      <div className="mb-10">
        <TxChart txs={txs} />
      </div>

      <BalanceChart />
    </FullLayout>
  );
}