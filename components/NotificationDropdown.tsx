// components/NotificationDropdown.tsx
import { useEffect, useState } from 'react';
import { onSnapshot, collection, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

type Notification = {
  id: string;
  status: 'success' | 'failed' | 'alert';
  timestamp: any;
  txHash: string;
  walletAddress: string;
};

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<Notification[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'notifications'), orderBy('timestamp', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Notification[];
      setNotifs(docs);
    });

    return () => unsub();
  }, []);

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="hover:text-cyan transition text-xl">🔔</button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-carbon border border-gray-700 rounded shadow-xl z-50 p-4">
          <h3 className="font-bold mb-2 text-orchid">Notifications</h3>
          {notifs.length === 0 && <p className="text-gray-400 text-sm">No notifications yet.</p>}
          <ul className="space-y-2">
            {notifs.map((n) => (
              <li key={n.id} className={`text-sm border p-2 rounded ${n.status === 'success' ? 'border-green-400' : n.status === 'failed' ? 'border-red-400' : 'border-yellow-400'}`}>
                <p><span className="font-bold">{n.status.toUpperCase()}</span> - {n.walletAddress.slice(0, 6)}... • {new Date(n.timestamp?.seconds * 1000).toLocaleTimeString()}</p>
                <p className="text-xs text-gray-400 truncate">{n.txHash}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}