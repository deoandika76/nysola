// pages/settings.tsx
import FullLayout from '../components/FullLayout';
import Head from 'next/head';

export default function SettingsPage() {
  return (
    <>
      <Head>
        <title>Settings - Nysola</title>
      </Head>
      <FullLayout>
        <h1 className="text-3xl font-bold text-pink-400 mb-6">⚙️ Settings</h1>
        <p className="text-gray-300 mb-4">Atur preferensi, konfigurasi wallet, dan sistem lainnya.</p>
        {/* 🚧 Belum ada pengaturan khusus */}
        <div className="text-gray-500">Pengaturan akan tersedia di update mendatang.</div>
      </FullLayout>
    </>
  );
}