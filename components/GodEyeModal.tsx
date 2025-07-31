// components/GodEyeModal.tsx
import { useState } from 'react';

export default function GodEyeModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/godeye', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await res.json();
      setResponse(data.result || 'No response.');
    } catch (err) {
      setResponse('❌ Error saat memanggil GOD EYE');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center px-4">
      <div className="bg-carbon p-6 rounded-lg w-full max-w-lg border border-orchid shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-orchid">🧠 GOD EYE Interface</h2>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Perintahmu untuk GOD EYE..."
          className="w-full p-2 rounded bg-black border border-gray-700 text-white mb-4"
          rows={4}
        />
        <div className="flex justify-between">
          <button
            onClick={handleSubmit}
            className="bg-orchid hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            disabled={loading}
          >
            {loading ? 'Thinking...' : 'Send'}
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white px-4"
          >
            Close
          </button>
        </div>
        {response && (
          <div className="mt-4 text-sm text-green-400 whitespace-pre-wrap border-t border-gray-600 pt-2">
            {response}
          </div>
        )}
      </div>
    </div>
  );
}