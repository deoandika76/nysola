// components/GodEyeModal.tsx
import { useState } from 'react';

export default function GodEyeModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setResponse('');
    setError('');
    try {
      const res = await fetch('/api/godeye', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await res.json();
      if (res.ok) {
        setResponse(data.result || '✅ Respons kosong.');
      } else {
        setError(data.error || '❌ Terjadi kesalahan.');
      }
    } catch (err) {
      setError('❌ Error saat memanggil GOD EYE.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setInput('');
    setResponse('');
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center px-4">
      <div className="bg-carbon p-6 rounded-lg w-full max-w-xl border border-orchid shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-orchid">🧠 GOD EYE Interface</h2>
        
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Perintahmu untuk GOD EYE..."
          className="w-full p-2 rounded bg-black border border-gray-700 text-white mb-4"
          rows={4}
        />

        <div className="flex justify-between gap-2 flex-wrap">
          <button
            onClick={handleSubmit}
            className="bg-orchid hover:bg-purple-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? '⏳ Loading...' : 'Send'}
          </button>
          <button
            onClick={handleReset}
            className="text-yellow-400 hover:text-yellow-200 px-4"
            disabled={loading}
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white px-4 ml-auto"
            disabled={loading}
          >
            Close
          </button>
        </div>

        {(response || error) && (
          <div className="mt-4 max-h-[300px] overflow-y-auto border-t border-gray-600 pt-2 px-2 bg-black rounded text-sm whitespace-pre-wrap">
            {response && <div className="text-green-400">{response}</div>}
            {error && <div className="text-red-400">{error}</div>}
          </div>
        )}
      </div>
    </div>
  );
}