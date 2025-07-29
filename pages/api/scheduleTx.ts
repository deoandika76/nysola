// pages/api/scheduleTx.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Only POST allowed' });

  const { address, scheduleTime } = req.body;

  try {
    await addDoc(collection(db, 'scheduled_tasks'), {
      address,
      scheduleTime: Timestamp.fromDate(new Date(scheduleTime)),
      status: 'pending',
      createdAt: Timestamp.now(),
    });

    res.status(200).json({ message: 'Task scheduled successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to schedule', error: error.message });
  }
}