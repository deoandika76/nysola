// pages/api/logNotification.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../firebase'; // ✅ HARUS sesuai posisi
import { addDoc, collection, Timestamp } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method allowed' });
  }

  try {
    const { message, type } = req.body;

    await addDoc(collection(db, 'notifications'), {
      message,
      type,
      timestamp: Timestamp.now(),
    });

    return res.status(200).json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}