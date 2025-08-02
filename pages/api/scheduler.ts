// pages/api/scheduler.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { runScheduledTransactions } from '../../utils/scheduler';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  const authHeader = req.headers.authorization;
  const validSecret = `Bearer ${process.env.CRON_SECRET}`;
  if (authHeader !== validSecret) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const results = await runScheduledTransactions();
    return res.status(200).json({ results });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}