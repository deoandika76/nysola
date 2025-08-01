import { useEffect, useRef, useState } from 'react';
import { db} from '../firebase';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  doc,
} from 'firebase/firestore';

type Notification = {
  id: string;
  status: 'success' | 'failed' | 'alert';
  txHash?: string;
  walletAddress?: string;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
  read?: boolean;
};

const statusIcons = {
  success: '✅',
  failed: '❌',
  alert: '⚠️',
};

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'success' | 'failed' | 'alert'>('all');
  const [highlightedIds, setHighlightedIds] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Real-time listener
  useEffect(() => {
    const q = query(collection(db, 'notifications'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newData = snapshot.docs.map((doc) => {
        const data = doc.data() as Omit<Notification, 'id'>;
        return {
          ...data,
          id: doc.id,
        };
      });
      setNotifications(newData);

      // Tambah efek highlight 5 detik buat yang baru
      const newIds = newData
        .filter((n) => !n.read)
        .map((n) => n.id);
      setHighlightedIds(newIds);
      setTimeout(() => setHighlightedIds([]), 5000);
    });

    return () => unsubscribe();
  }, []);

  // Auto mark as read kalau dibuka
  useEffect(() => {
    if (open) {
      notifications.forEach(async (n) => {
        if (!n.read) {
          await updateDoc(doc(db, 'notifications', n.id), { read: true });
        }
      });
    }
  }, [open]);

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

  const filteredNotifs =
    filter === 'all'
      ? notifications
      : notifications.filter((n) => n.status === filter);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative text-white text-xl focus:outline-none"
        aria-label="Notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 max-h-96 overflow-y-auto bg-carbon border border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-gray-600 font-semibold text-orchid">
            Real-Time Notifications
          </div>

          {/* Filter */}
          <div className="flex justify-around p-2 border-b border-gray-700 text-sm text-white">
            {['all', 'success', 'failed', 'alert'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-2 py-1 rounded ${
                  filter === f ? 'bg-orchid text-black font-bold' : 'hover:bg-gray-700'
                }`}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>

          {filteredNotifs.length === 0 ? (
            <p className="p-4 text-gray-400">Belum ada notifikasi.</p>
          ) : (
            <ul className="divide-y divide-gray-700">
              {filteredNotifs.map((n) => (
                <li
                  key={n.id}
                  className={`p-3 text-sm ${getStatusColor(n.status)} ${
                    highlightedIds.includes(n.id) ? 'bg-gray-800 animate-pulse' : ''
                  }`}
                >
                  <div className="font-bold capitalize flex items-center space-x-2">
                    <span>{statusIcons[n.status]}</span>
                    <span>{n.status}</span>
                  </div>
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