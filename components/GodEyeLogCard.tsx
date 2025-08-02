// components/GodEyeLogCard.tsx
import { Timestamp } from 'firebase/firestore';

export default function GodEyeLogCard({ log }: {
  log: {
    id: string;
    prompt: string;
    result: string;
    timestamp: Timestamp;
  };
}) {
  const date = new Date(log.timestamp.seconds * 1000).toLocaleString();

  return (
    <div className="bg-carbon border border-orchid rounded-lg p-4 shadow">
      <p className="text-sm text-gray-400 mb-2">🕒 {date}</p>
      <p className="text-cyan-400 font-semibold">🧠 Prompt:</p>
      <p className="mb-2 whitespace-pre-wrap">{log.prompt}</p>
      <p className="text-green-400 font-semibold">📡 Result:</p>
      <p className="whitespace-pre-wrap">{log.result}</p>
    </div>
  );
}