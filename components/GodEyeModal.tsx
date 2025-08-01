// components/GodEyeModal.tsx
import { useEffect, useRef, useState } from 'react';

export default function GodEyeModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const responseRef = useRef<HTMLDivElement | null>(null);

  const handleSubmit = async () => {
    if (!input.trim()) {
      setError('❗Prompt tidak boleh kosong');
      return;
    }

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
      setError('❌ Gagal memanggil GOD EYE.');
    } finally {
      setLoading(false);
    }
  };

  // Scroll otomatis ke bawah saat respons muncul
  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [response, error]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center px-4">
      <div className="bg-carbon p-6 rounded-lg w-full max-w-lg border border-orchid shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-orchid">🧠 GOD EYE Interface</h2>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Perintahmu untuk GOD EYE..."
          className="w-full p-2 rounded bg-black border border-gray-700 text-white mb-4"
          rows={4}
        />

        <div className="flex justify-between mb-4">
          <button
            onClick={handleSubmit}
            className="bg-orchid hover:bg-purple-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? '⚙️ Thinking...' : '🚀 Send'}
          </button>
          <button onClick={onClose} className="text-gray-400 hover:text-white px-4">
            ❌ Close
          </button>
        </div>

        <div ref={responseRef}>
          {response && (
            <div className="text-sm text-green-400 whitespace-pre-wrap border-t border-gray-600 pt-2">
              {response}
            </div>
          )}
          {error && (
            <div className="text-sm text-red-400 whitespace-pre-wrap border-t border-gray-600 pt-2">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}