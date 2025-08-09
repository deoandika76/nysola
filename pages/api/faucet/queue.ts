// pages/api/faucet/queue.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { enqueueFaucetJob } from '../../../utils/faucetRunner';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { wallet, chain } = req.body as { wallet?: string; chain?: 'sepolia'|'scroll'|'starknet'|'zeta' };
  if (!wallet || !chain) return res.status(400).json({ error: 'wallet & chain required' });

  await enqueueFaucetJob({ wallet, chain });
  res.status(200).json({ ok: true, message: 'Queued' });
}