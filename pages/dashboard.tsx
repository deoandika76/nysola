// pages/dashboard.tsx
import { useEffect, useState } from 'react';
import Head from 'next/head';
import DashboardCard from '../components/DashboardCard';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import { listenToTxHistory } from '../firebase';

export default function Dashboard() {
  const [txCount, setTxCount] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [navbarOpen, setNavbarOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = listenToTxHistory((data) => {
      setTxCount(data.length);
      setSuccessCount(data.filter((d) => d.status === 'success').length);
      setFailedCount(data.filter((d) => d.status === 'failed').length);
    });

    return () => unsubscribe(); // cleanup listener saat unmount
  }, []);

  return (
    <>
      <Head>
        <title>Dashboard - Nysola</title>
      </Head>

      {/* ✅ FIX: Lengkapi props isOpen & onClose */}
      <Header onToggleNavbar={() => setNavbarOpen(!navbarOpen)} />
      <Navbar isOpen={navbarOpen} onClose={() => setNavbarOpen(false)} />

      <main className="pt-20 px-6 md:px-16 pb-12 bg-black min-h-screen text-white">
        <h1 className="text-3xl font-bold mb-6 text-cyan">📊 Dashboard Analytics</h1>

        <div className="flex flex-wrap gap-6 justify-center">
          <DashboardCard title="Total Transactions" value={txCount.toString()} icon="📦" />
          <DashboardCard title="Success" value={successCount.toString()} icon="✅" color="text-green-400" />
          <DashboardCard title="Failed" value={failedCount.toString()} icon="❌" color="text-red-500" />
        </div>
      </main>
    </>
  );
}