import { useEffect, useRef, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

type Notification = {
  id: string;
  status: 'success' | 'failed' | 'alert';
  txHash?: string;
  walletAddress?: string;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
};

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'notifications'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Notification),
      }));
      setNotifications(newData);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getStatusColor = (status: string) => {
    if (status === 'success') return 'text-green-400';
    if (status === 'failed') return 'text-red-500';
    return 'text-yellow-300';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="text-white text-xl focus:outline-none"
        aria-label="Notifications"
      >
        🔔
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 max-h-96 overflow-y-auto bg-carbon border border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-gray-600 font-semibold text-orchid">
            Real-Time Notifications
          </div>
          {notifications.length === 0 ? (
            <p className="p-4 text-gray-400">Belum ada notifikasi.</p>
          ) : (
            <ul className="divide-y divide-gray-700">
              {notifications.map((n) => (
                <li key={n.id} className={`p-3 text-sm ${getStatusColor(n.status)}`}>
                  <div className="font-bold capitalize">{n.status}</div>
                  {n.txHash && (
                    <p className="text-xs truncate">TX: {n.txHash}</p>
                  )}
                  {n.walletAddress && (
                    <p className="text-xs truncate">From: {n.walletAddress}</p>
                  )}
                  <p className="text-gray-500 text-xs">
                    {new Date(n.timestamp.seconds * 1000).toLocaleString('id-ID')}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}