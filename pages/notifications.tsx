// pages/notifications.tsx
import { useEffect, useState } from 'react';
import { listenToNotifications } from '../firebase';
import Layout from '../components/Layout';

type Notification = {
  message: string;
  timestamp: {
    seconds: number;
  };
  type: 'success' | 'error' | 'alert';
};

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<Notification[]>([]);

  useEffect(() => {
    const unsubscribe = listenToNotifications((data) => {
      const sorted = data
        .map((n) => n as Notification)
        .sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
      setNotifs(sorted);
    });

    return () => unsubscribe(); // cleanup
  }, []);

  const getColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-800 border-green-500';
      case 'error':
        return 'bg-red-800 border-red-500';
      case 'alert':
        return 'bg-yellow-800 border-yellow-500';
      default:
        return 'bg-gray-800 border-gray-600';
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-orchid mb-4">📢 Notifications</h1>
      <p className="text-gray-400 mb-6">Log: task sukses, gagal, blacklist, reward masuk</p>

      {notifs.length === 0 && (
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
    </Layout>
  );
}