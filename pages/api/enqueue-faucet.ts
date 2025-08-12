// pages/api/enqueue-faucet.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { enqueueFaucetJob } from '@/utils/faucetRunner';
import { FaucetChain } from '@/utils/faucetAdapters';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST allowed' });

  try {
    const { chain, wallet } = req.body as { chain: FaucetChain; wallet: string };
    if (!chain || !wallet) {
      return res.status(400).json({ error: 'Missing chain or wallet' });
    }

    await enqueueFaucetJob({ chain, wallet });
    return res.status(200).json({ ok: true });
  } catch (e: any) {
    console.error('enqueue-faucet error:', e);
    return res.status(500).json({ error: e?.message || 'internal_error' });
  }
}