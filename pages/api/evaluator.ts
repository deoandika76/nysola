// pages/api/evaluator.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { ethers } from 'ethers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const snapshot = await getDocs(collection(db, 'txHistory'));

    const updates = [];

    for (const tx of snapshot.docs) {
      const data = tx.data();
      if (!data.txHash || data.status === 'success') continue;

      try {
        const receipt = await provider.getTransactionReceipt(data.txHash);
        if (receipt && receipt.status === 1) {
          const txRef = doc(db, 'txHistory', tx.id);
          updates.push(updateDoc(txRef, { status: 'success' }));
        }
      } catch (e) {
        // skip if error
      }
    }

    await Promise.all(updates);
    res.status(200).json({ message: 'Evaluasi selesai' });
  } catch (err) {
    console.error('[Evaluator Error]', err);
    res.status(500).json({ error: 'Evaluasi gagal' });
  }
}