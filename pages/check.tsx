// pages/check.tsx

import { useState } from 'react';
import Layout from '../components/Layout';

export default function CheckSchedulePage() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    setLoading(true);
    setStatus('');
    try {
      const res = await fetch('/api/checkSchedule');
      const data = await res.json();

      if (res.ok) {
        setStatus(`✅ ${data.message}`);
      } else {
        setStatus(`❌ Error: ${data.message}`);
      }
    } catch (err: any) {
      setStatus(`❌ Gagal: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4 text-purple-400">🔍 Cek Jadwal Transaksi</h1>
      <p className="text-gray-400 mb-6">Menjalankan fungsi <code>/api/checkSchedule</code></p>

      <button
        onClick={handleCheck}
        disabled={loading}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
      >
        {loading ? 'Mengecek...' : 'Cek & Jalankan'}
      </button>

      {status && (
        <div className="mt-4 bg-black text-green-400 p-4 rounded font-mono">
          {status}
        </div>
      )}
    </Layout>
  );
}