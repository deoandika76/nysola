// pages/dashboard.tsx
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { fetchTxHistory } from '../firebase';
import DashboardCard from '../components/DashboardCard';

export default function Dashboard() {
  const [txCount, setTxCount] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      const txs = await fetchTxHistory();
      setTxCount(txs.length);
      setSuccessCount(txs.filter((t) => t.status === 'success').length);
      setFailedCount(txs.filter((t) => t.status === 'failed').length);
    };
    load();
  }, []);

  return (
    <>
      <Head>
        <title>Nysola Dashboard</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-b from-black via-[#111] to-[#1a1a1a] text-white px-6 pt-24 md:px-20">
        <h1 className="text-4xl font-bold text-cyan mb-8 text-center">📊 Dashboard Analytics</h1>

        <div className="flex flex-wrap gap-6 justify-center">
          <DashboardCard title="Total Transactions" value={txCount.toString()} icon="📦" />
          <DashboardCard title="Success" value={successCount.toString()} icon="✅" color="text-green-400" />
          <DashboardCard title="Failed" value={failedCount.toString()} icon="❌" color="text-red-500" />
        </div>
      </div>
    </>
  );
}