// pages/dashboard.tsx
import { useEffect, useState } from 'react';
import Head from 'next/head';
import DashboardCard from '../components/DashboardCard';
import { fetchTxHistory } from '../firebase';
import Header from '../components/Header';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const [txCount, setTxCount] = useState<number | null>(null);
  const [successCount, setSuccessCount] = useState<number | null>(null);
  const [failedCount, setFailedCount] = useState<number | null>(null);
  const [navbarOpen, setNavbarOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchTxHistory();
      setTxCount(data.length);
      setSuccessCount(data.filter((d) => d.status === 'success').length);
      setFailedCount(data.filter((d) => d.status === 'failed').length);
    };
    loadData();
  }, []);

  return (
    <>
      <Head>
        <title>Dashboard - Nysola</title>
      </Head>

      <Header onToggleNavbar={() => setNavbarOpen(!navbarOpen)} />
      <Navbar isOpen={navbarOpen} />

      <main className="pt-20 px-6 md:px-16 pb-12 bg-black min-h-screen text-white">
        <h1 className="text-3xl font-bold mb-6 text-cyan">📊 Dashboard Analytics</h1>

        <div className="flex flex-wrap gap-6 justify-center">
          <DashboardCard
            title="Total Transactions"
            value={txCount !== null ? txCount.toString() : '⏳'}
            icon="📦"
          />
          <DashboardCard
            title="Success"
            value={successCount !== null ? successCount.toString() : '⏳'}
            icon="✅"
            color="text-green-400"
          />
          <DashboardCard
            title="Failed"
            value={failedCount !== null ? failedCount.toString() : '⏳'}
            icon="❌"
            color="text-red-500"
          />
        </div>
      </main>
    </>
  );
}