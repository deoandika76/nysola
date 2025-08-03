// pages/api/cron-execute.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { executeAutoTask } from '../../utils/executor';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Only POST allowed for cron' });
  }

  try {
    const result = await executeAutoTask();
    return res.status(200).json({ status: 'success', message: result });
  } catch (err: any) {
    console.error('Cron Executor Error:', err);
    return res.status(500).json({ status: 'error', message: err.message || 'Unexpected error' });
  }
}