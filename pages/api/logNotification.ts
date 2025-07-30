// pages/api/logNotification.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../lib/firebase'; // pastikan path-nya sesuai
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST method allowed' });
  }

  const { message, type } = req.body;

  if (!message || !type) {
    return res.status(400).json({ message: 'Missing message or type' });
  }

  try {
    await addDoc(collection(db, 'logNotifications'), {
      message,
      type,
      timestamp: Timestamp.now(),
    });

    return res.status(200).json({ message: 'Notification logged' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}