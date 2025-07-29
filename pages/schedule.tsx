// pages/schedule.tsx

import { useState } from 'react';
import Layout from '../components/Layout';

export default function SchedulePage() {
  const [address, setAddress] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSchedule = async () => {
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/scheduleTx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, scheduleTime }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ ${data.message}`);
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err: any) {
      setMessage(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-purple-500 mb-4">📅 Schedule TX</h1>
      <p className="text-gray-400 mb-6">Jadwalkan transaksi otomatis berdasarkan waktu tertentu.</p>

      <input
        type="text"
        placeholder="Wallet address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="mb-4 w-full p-2 bg-black border border-gray-700 rounded text-white"
      />

      <input
        type="datetime-local"
        value={scheduleTime}
        onChange={(e) => setScheduleTime(e.target.value)}
        className="mb-4 w-full p-2 bg-black border border-gray-700 rounded text-white"
      />

      <button
        onClick={handleSchedule}
        disabled={loading}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
      >
        {loading ? 'Menjadwalkan...' : '🚀 Jadwalkan TX'}
      </button>

      {message && (
        <div className="mt-4 bg-black text-green-400 p-4 rounded font-mono">
          {message}
        </div>
      )}
    </Layout>
  );
}