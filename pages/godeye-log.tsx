// pages/godeye-log.tsx
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, Timestamp } from 'firebase/firestore';
import Layout from '../components/Layout';

interface Log {
  id: string;
  prompt: string;
  response: string;
  timestamp: Timestamp;
}

export default function GodEyeLogPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      const snapshot = await getDocs(collection(db, 'godeyeLogs'));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Log, 'id'>),
      }));
      setLogs(data);
      setLoading(false);
    }

    fetchLogs();
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-orchid">📜 GOD EYE Logs</h1>
        {loading ? (
          <p className="text-gray-400">Loading logs...</p>
        ) : logs.length === 0 ? (
          <p className="text-gray-500">Belum ada log yang tercatat.</p>
        ) : (
          <ul className="space-y-4">
            {logs.map((log) => (
              <li key={log.id} className="border border-gray-700 rounded-lg p-4 bg-carbon/70">
                <p className="text-sm text-gray-400 mb-1">
                  {log.timestamp.toDate().toLocaleString()}
                </p>
                <p className="font-semibold text-cyan-400">🧾 Prompt:</p>
                <p className="whitespace-pre-wrap mb-2">{log.prompt}</p>
                <p className="font-semibold text-green-400">🤖 Response:</p>
                <p className="whitespace-pre-wrap text-white">{log.response}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}