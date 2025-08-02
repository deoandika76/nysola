// pages/tasks.tsx
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import FullLayout from '../components/FullLayout';

type Task = {
  id: string;
  type: string;
  walletAddress: string;
  status: 'pending' | 'success' | 'failed';
  createdAt: {
    seconds: number;
  };
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const snapshot = await getDocs(collection(db, 'tasks'));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Task) }));
      setTasks(data);
    };

    fetchTasks();
  }, []);

  return (
    <FullLayout title="Tasks">
      <h1 className="text-3xl font-bold mb-6 text-purple-400">🧠 Task Executor</h1>

      {tasks.length === 0 && <p className="text-gray-400">Belum ada task terdaftar.</p>}

      <div className="grid gap-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`p-4 rounded shadow border-l-4 ${
              task.status === 'success'
                ? 'border-green-500 bg-green-900'
                : task.status === 'failed'
                ? 'border-red-500 bg-red-900'
                : 'border-yellow-500 bg-yellow-900'
            }`}
          >
            <p>⚙️ Type: <span className="font-bold">{task.type}</span></p>
            <p>👛 Wallet: <span className="text-cyan-300">{task.walletAddress}</span></p>
            <p>📅 Time: {new Date(task.createdAt.seconds * 1000).toLocaleString('id-ID')}</p>
            <p>Status: <span className="uppercase">{task.status}</span></p>
          </div>
        ))}
      </div>
    </FullLayout>
  );
}