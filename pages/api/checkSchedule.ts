import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ethers } from 'ethers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const snapshot = await getDocs(collection(db, 'scheduled_tasks'));
    const now = Date.now();

    const results: string[] = [];

    for (const taskDoc of snapshot.docs) {
      const task = taskDoc.data();

      const scheduledAt = task.scheduledAt?.seconds * 1000;
      const isDue = scheduledAt <= now;

      if (!isDue) continue;

      const wallet = new ethers.Wallet(task.privateKey, new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_SEPOLIA_RPC!));

      try {
        const tx = await wallet.sendTransaction({
          to: task.to,
          value: ethers.parseEther(task.value),
        });

        await tx.wait();

        results.push(`✅ TX sent: ${tx.hash}`);

        // Delete task after sent
        await deleteDoc(doc(db, 'scheduled_tasks', taskDoc.id));
      } catch (txError: any) {
        results.push(`❌ TX failed for ${task.to}: ${txError.message}`);
      }
    }

    res.status(200).json({ message: 'Check complete', results });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}