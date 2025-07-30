// components/Header.tsx
import { useEffect, useState, useRef } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

export default function Header({ onToggleNavbar }: { onToggleNavbar: () => void }) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(collection(db, 'notifications'), orderBy('timestamp', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data());
      setNotifications(data);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="w-full flex justify-between items-center bg-carbon p-4 shadow-md fixed top-0 left-0 z-20">
      <h1 className="text-xl font-bold text-orchid">NYSOLA</h1>
      
      <div className="flex items-center space-x-4 relative">
        {/* Notif bell */}
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="text-white text-2xl hover:text-cyan transition relative"
        >
          🔔
        </button>

        {showDropdown && (
          <div
            ref={dropdownRef}
            className="absolute right-12 top-10 bg-[#222] text-white rounded-xl w-72 max-h-96 overflow-auto shadow-lg z-30 border border-gray-600"
          >
            <div className="p-3 border-b border-gray-700 font-bold text-orchid">
              📢 Notifikasi Terbaru
            </div>
            {notifications.length === 0 ? (
              <div className="p-4 text-gray-400 text-sm">Belum ada notifikasi</div>
            ) : (
              notifications.map((notif, idx) => (
                <div
                  key={idx}
                  className={`p-3 text-sm border-b border-gray-700 ${
                    notif.status === 'success' ? 'text-green-400' :
                    notif.status === 'failed' ? 'text-red-400' : 'text-yellow-400'
                  }`}
                >
                  {notif.message}
                </div>
              ))
            )}
          </div>
        )}

        {/* Hamburger */}
        <button
          onClick={onToggleNavbar}
          className="text-white text-2xl hover:text-cyan transition"
        >
          ☰
        </button>
      </div>
    </header>
  );
}