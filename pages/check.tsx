// pages/check.tsx/
import FullLayout from '../components/FullLayout';
import Head from 'next/head';

export default function CheckSchedulePage() {
  return (
    <>
      <Head>
        <title>Check TX Schedule - Nysola</title>
      </Head>
      <FullLayout>
        <h1 className="text-3xl font-bold text-yellow-400 mb-6">⏱️ Check TX Schedule</h1>
        <p className="text-gray-300 mb-4">Gunakan halaman ini untuk memicu task scheduler atau pengecekan transaksi otomatis.</p>
        {/* Tombol atau fungsi trigger akan ditambahkan di sini */}
        <button className="bg-cyan px-4 py-2 rounded text-white hover:bg-opacity-80">
          🔁 Check Schedule Now
        </button>
      </FullLayout>
    </>
  );
}