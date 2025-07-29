
import { useState } from 'react';

export default function PromptBar() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResponse(`🧠 Nysola menerima prompt: "${prompt}" dan sedang memproses...`);
    setPrompt('');
  };

  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full bg-carbon border border-gray-600 text-white px-4 py-2 rounded"
          placeholder="Tulis instruksi ke Nysola..."
        />
        <button type="submit" className="bg-orchid px-4 py-2 rounded text-black font-bold w-full sm:w-auto">
          Kirim
        </button>
      </form>
      {response && <p className="mt-4 text-cyan">{response}</p>}
    </div>
  );
}