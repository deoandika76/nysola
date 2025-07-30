import { useEffect, useState } from 'react';
import Head from 'next/head';
import DashboardCard from '../components/DashboardCard';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export default function Dashboard() {
  const [txCount, setTxCount] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);

  useEffect(() => {
    const fetchTxStats = async () => {
      const snapshot = await getDocs(collection(db, 'txHistory'));
      const txList = snapshot.docs.map(doc => doc.data());
      setTxCount(txList.length);

      const success = txList.filter((tx: any) => tx.status === 'success').length;
      const failed = txList.filter((tx: any) => tx.status === 'failed').length;

      setSuccessCount(success);
      setFailedCount(failed);
    };

    fetchTxStats();
  }, []);

  return (
    <>
      <Head>
        <title>Nysola Dashboard</title>
      </Head>
      <div className="min-h-screen bg-black text-white px-6 pt-20">
        <h1 className="text-4xl font-bold text-cyan mb-8 text-center">
          🚀 Welcome Back, Commander
        </h1>

        <div className="flex flex-wrap gap-6 justify-center">
          <DashboardCard title="Total Transactions" value={txCount} icon="📦" />
          <DashboardCard title="Success" value={successCount} icon="✅" color="text-green-400" />
          <DashboardCard title="Failed" value={failedCount} icon="❌" color="text-red-500" />
        </div>
      </div>
    </>
  );
}