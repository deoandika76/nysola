// pages/api/faucet-drain.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { processOneFaucetJob } from '../../utils/faucetRunner';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Only POST allowed');

  const count = Math.min(parseInt(String(req.query.n || '3'), 10) || 3, 10); // default 3, max 10
  const runs: any[] = [];
  for (let i = 0; i < count; i++) {
    // jalanin satu-satu biar ordering ke-keep
    // kalau mau paralel ganti ke Promise.all, tapi risiko rate-limit faucet
    // lebih besar.
    // eslint-disable-next-line no-await-in-loop
    const out = await processOneFaucetJob().catch((e) => `ERR: ${e?.message || e}`);
    runs.push(out);
  }

  res.status(200).json({ ok: true, runs });
}