import { useState } from 'react';
import Layout from '../components/Layout';

export default function AutoTaskPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleRunAutoTask = async () => {
    setLoading(true);
    setResult('');

    try {
      const res = await fetch('/api/autoTask', {
        method: 'POST',
      });

      const data = await res.json();
      if (res.ok) {
        setResult(JSON.stringify(data.results, null, 2));
      } else {
        setResult(`❌ Gagal: ${data.message || data.error}`);
      }
    } catch (err: any) {
      setResult(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-purple-500 mb-4">🤖 Jalankan Auto Task</h1>
      <p className="mb-6 text-gray-400">Fitur ini akan menjalankan transaksi otomatis dari semua wallet testnet.</p>

      <button
        onClick={handleRunAutoTask}
        disabled={loading}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
      >
        {loading ? 'Menjalankan...' : '🚀 Jalankan Auto Task'}
      </button>

      {result && (
        <pre className="mt-6 bg-black text-green-400 p-4 rounded overflow-x-auto text-sm whitespace-pre-wrap break-words">
          {result}
        </pre>
      )}
    </Layout>
  );
}