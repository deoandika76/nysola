// pages/api/updateMissionProgress.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  const { walletAddress, missionId, status } = req.body;

  if (!walletAddress || !missionId || !status) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    await addDoc(collection(db, 'missionsProgress'), {
      walletAddress,
      missionId,
      status,
      timestamp: Timestamp.now(),
    });

    return res.status(200).json({ message: 'Mission progress saved' });
  } catch (err: any) {
    console.error('[updateMissionProgress] Error:', err);
    return res.status(500).json({ message: err.message });
  }
}