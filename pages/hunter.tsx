// pages/hunter.tsx
import { useState } from 'react';

export default function HunterPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const runHunter = async () => {
    setStatus('loading');
    setMessage('Running hunterExecutor...');

    try {
      const res = await fetch('/api/hunterExecute', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET}`, // opsional kalau pakai auth
        },
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(`✅ Success: ${data.results.length} wallet executed.`);
      } else {
        setStatus('error');
        setMessage(`❌ Error: ${data.error || 'Something went wrong'}`);
      }
    } catch (err: any) {
      setStatus('error');
      setMessage(`❌ Exception: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 space-y-4">
      <h1 className="text-2xl font-bold text-purple-400">Hunter Executor 🔫</h1>

      <button
        onClick={runHunter}
        disabled={status === 'loading'}
        className="bg-purple-600 hover:bg-purple-800 px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50"
      >
        {status === 'loading' ? 'Executing...' : 'RUN Hunter Executor'}
      </button>

      {message && (
        <div
          className={`text-sm px-4 py-2 rounded ${
            status === 'success' ? 'bg-green-700' :
            status === 'error' ? 'bg-red-700' :
            'bg-yellow-700'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}