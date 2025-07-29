import { useState } from 'react';

export default function WalletsPage() {
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    try {
      const res = await fetch('/api/generate-wallet', {
        method: 'POST',
      });

      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setResult('❌ Error generating wallet');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-purple-500">Generate Wallet</h1>
      <button
        onClick={handleGenerate}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        Generate Wallet 🔐
      </button>

      {result && (
        <pre className="mt-4 p-4 bg-gray-900 text-green-400 rounded">
          {result}
        </pre>
      )}
    </div>
  );
}