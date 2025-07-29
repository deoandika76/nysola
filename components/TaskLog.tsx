import { useState, useEffect } from 'react';

const dummyLogs = [
  '🧠 Menganalisis wallet eligibility...',
  '🔍 Scraping proyek testnet terbaru...',
  '✅ Join Discord: zeta-chain',
  '⚙️ Submit Zealy quest auto-farming...',
  '🚀 Simulasi TX berhasil di wallet ke-2',
  '🔥 Task batch #02 selesai dieksekusi!',
];

export default function TaskLog() {
  const [logs, setLogs] = useState<string[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (index < dummyLogs.length) {
        setLogs((prev) => [...prev, dummyLogs[index]]);
        setIndex((prev) => prev + 1);
      }
    }, 1800);
    return () => clearInterval(interval);
  }, [index]);

  return (
    <div className="mt-6 bg-[#1a1a1a] p-4 rounded border border-gray-700">
      <h2 className="text-lg text-cyan font-semibold mb-2">🧾 Task Execution Log</h2>
      <div className="text-sm space-y-1 text-gray-300">
        {logs.map((log, i) => (
          <div key={i}>➤ {log}</div>
        ))}
      </div>
    </div>
  );
}