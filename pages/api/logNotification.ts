// pages/api/logNotification.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Only POST allowed' });

  // ✅ Authorization check pakai req.headers['authorization']
  const authHeader = req.headers['authorization'];
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { message, type } = req.body;

    await addDoc(collection(db, 'notifications'), {
      message,
      type,
      timestamp: Timestamp.now()
    });

    res.status(200).json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}