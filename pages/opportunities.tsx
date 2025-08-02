// pages/opportunities.tsx
import FullLayout from '../components/FullLayout';
import Head from 'next/head';

export default function Opportunities() {
  return (
    <>
      <Head>
        <title>Opportunities - Nysola</title>
      </Head>
      <FullLayout>
        <h1 className="text-3xl font-bold text-green-400 mb-6">💰 Opportunities</h1>
        <p className="text-gray-300">Temukan peluang cuan gratis dari testnet, faucet, swap, Galxe, Zealy, dan lainnya.</p>
        {/* 🔮 Tambahkan konten dinamis di sini nanti */}
        <div className="mt-6 text-gray-400">Belum ada data peluang saat ini.</div>
      </FullLayout>
    </>
  );
}