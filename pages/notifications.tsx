// pages/notifications.tsx
import { useEffect, useState } from 'react';
import FullLayout from '../components/FullLayout';
import {
  collection,
  query,
  orderBy,
  limit,
  where,
  Timestamp,
  getDocs,
} from 'firebase/firestore';
import { db } from '../firebase';

type Notification = {
  message: string;
  timestamp: { seconds: number };
  type: 'success' | 'error' | 'alert' | 'reward';
};

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔕 Ganti realtime listener → fetch periodik ringan (hemat kuota)
  useEffect(() => {
    let timer: any;

    const fetchLight = async () => {
      setLoading(true);
      try {
        const sevenDaysAgo = Timestamp.fromDate(
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        );
        const q = query(
          collection(db, 'notifications'),
          where('timestamp', '>=', sevenDaysAgo),
          orderBy('timestamp', 'desc'),
          limit(50)
        );
        const snap = await getDocs(q);
        const rows = snap.docs
          .map((d) => d.data() as Notification)
          .filter((n) => n?.timestamp?.seconds);
        setNotifs(rows);
      } catch (e) {
        console.error('Fetch notifications error:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchLight();
    // refresh ringan tiap 60 detik
    timer = setInterval(fetchLight, 60_000);

    return () => clearInterval(timer);
  }, []);

  const getColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-800 border-green-500';
      case 'error':
        return 'bg-red-800 border-red-500';
      case 'reward':
        return 'bg-yellow-800 border-yellow-500';
      case 'alert':
        return 'bg-orange-800 border-orange-500';
      default:
        return 'bg-gray-800 border-gray-600';
    }
  };

  return (
    <FullLayout title="Notifications">
      <h1 className="text-2xl font-bold text-orchid mb-4">📢 Notifications</h1>
      <p className="text-gray-400 mb-6">
        Log: task sukses, gagal, blacklist, reward masuk (last 7 days, max 50).
      </p>

      {loading && <p className="text-gray-500">Loading…</p>}
      {!loading && notifs.length === 0 && (
        <p className="text-gray-500">Belum ada notifikasi.</p>
      )}

      <div className="space-y-4">
        {notifs.map((notif, idx) => (
          <div
            key={idx}
            className={`border-l-4 p-4 rounded shadow-md ${getColor(notif.type)}`}
          >
            <p className="text-white">{notif.message}</p>
            <p className="text-xs text-gray-300 mt-1">
              {new Date(notif.timestamp.seconds * 1000).toLocaleString('id-ID')}
            </p>
          </div>
        ))}
      </div>
    </FullLayout>
  );
}