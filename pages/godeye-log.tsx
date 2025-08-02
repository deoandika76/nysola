// pages/godeye-log.tsx
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, Timestamp } from 'firebase/firestore';
import GodEyeLogCard from '../components/GodEyeLogCard';

type GodEyeLog = {
  id: string;
  prompt: string;
  result: string;
  timestamp: Timestamp;
};

export default function GodEyeLogPage() {
  const [logs, setLogs] = useState<GodEyeLog[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'godeyeLogs'), (snapshot) => {
      const fetched: GodEyeLog[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<GodEyeLog, 'id'>),
      }));

      // Urutkan dari terbaru
      setLogs(fetched.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds));
    });

    return () => unsub();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-orchid mb-6">📜 God Eye Logs</h1>
      <div className="space-y-4">
        {logs.length === 0 ? (
          <p className="text-gray-400">Belum ada evaluasi.</p>
        ) : (
          logs.map((log) => <GodEyeLogCard key={log.id} log={log} />)
        )}
      </div>
    </div>
  );
}