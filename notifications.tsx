import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from './firebase';

type Notification = {
  id: string;
  message: string;
  type: string;
  timestamp: { seconds: number };
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, 'notifications'), orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      const result = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[];
      setNotifications(result);
    };

    fetchData();
  }, []);

  const getColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-500';
      case 'reward': return 'text-yellow-400';
      case 'alert': return 'text-orange-400';
      default: return 'text-white';
    }
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4 text-purple-400">📢 Notifikasi Sistem</h1>
      {notifications.length === 0 ? (
        <p className="text-gray-400">Belum ada notifikasi.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((note) => (
            <li key={note.id} className={`p-4 bg-[#1e1e1e] border-l-4 ${getColor(note.type)} rounded`}>
              <p>{note.message}</p>
              <p className="text-sm text-gray-400">{new Date(note.timestamp.seconds * 1000).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}