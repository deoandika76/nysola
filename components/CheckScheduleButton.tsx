import { useState } from 'react';

export default function CheckScheduleButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleCheckSchedule = async () => {
    setLoading(true);
    setResult('');

    try {
      const res = await fetch('/api/checkSchedule', {
        method: 'POST',
      });

      const data = await res.json();
      if (res.ok) {
        setResult(`✅ ${data.message || 'Pengecekan selesai'}`);
      } else {
        setResult(`❌ ${data.message || 'Terjadi kesalahan'}`);
      }
    } catch (err: any) {
      setResult(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-6">
      <button
        onClick={handleCheckSchedule}
        disabled={loading}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
      >
        {loading ? 'Memeriksa...' : '🔁 Check Scheduled TX'}
      </button>

      {result && (
        <div className="mt-3 text-sm text-green-400 bg-gray-900 p-3 rounded font-mono">
          {result}
        </div>
      )}
    </div>
  );
}