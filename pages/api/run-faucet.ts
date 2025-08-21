import type { NextApiRequest, NextApiResponse } from 'next';
import { processOneFaucetJob } from '@/utils/faucetRunner';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const out = await processOneFaucetJob();
    return res.status(200).json({ ok: true, out });
  } catch (e: any) {
    console.error('run-faucet error:', e);
    return res.status(500).json({ ok: false, error: e?.message || 'internal_error' });
  }
}
