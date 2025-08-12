// pages/api/enqueue-faucet.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { enqueueFaucetJob } from '../../utils/faucetRunner';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Only POST allowed');

  try {
    const { wallet, chain } = req.body || {};
    if (!wallet || !chain) {
      return res.status(400).json({ ok: false, message: 'wallet & chain required' });
    }
    await enqueueFaucetJob({ wallet, chain });
    return res.status(200).json({ ok: true, message: 'Job enqueued' });
  } catch (e: any) {
    return res.status(500).json({ ok: false, message: e?.message || 'enqueue_error' });
  }
}