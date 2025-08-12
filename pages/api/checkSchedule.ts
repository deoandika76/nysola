// pages/api/checkSchedule.ts/
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../firebase';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit as fsLimit,
  deleteDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';
import { ethers } from 'ethers';

function assertAuthorized(req: NextApiRequest) {
  const auth = req.headers.authorization || '';
  const expected = `Bearer ${process.env.CRON_SECRET}`;
  return auth === expected;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }
  if (!assertAuthorized(req)) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Ambil task yang due saja, maksimum 3 per run (hemat)
    const nowSec = Math.floor(Date.now() / 1000);
    const q = query(
      collection(db, 'scheduled_tasks'),
      where('scheduledAt', '<=', Timestamp.fromMillis(nowSec * 1000)),
      orderBy('scheduledAt', 'asc'),
      fsLimit(3)
    );

    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return res.status(200).json({ message: 'No due tasks', results: [] });
    }

    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_SEPOLIA_RPC!);
    const results: string[] = [];

    for (const taskDoc of snapshot.docs) {
      const task = taskDoc.data() as any;

      try {
        const wallet = new ethers.Wallet(task.privateKey, provider);
        const tx = await wallet.sendTransaction({
          to: task.to,
          value: ethers.parseEther(task.value),
        });
        await tx.wait();

        results.push(`✅ TX sent: ${tx.hash}`);

        // Hapus task setelah sukses (hemat: 1 write saja per task)
        await deleteDoc(doc(db, 'scheduled_tasks', taskDoc.id));
      } catch (txError: any) {
        results.push(`❌ TX failed for ${task.to}: ${txError.message}`);
        // (Opsional) bisa tambahkan retry counter di dokumen jika diperlukan
      }
    }

    return res.status(200).json({ message: 'Check complete', results });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
