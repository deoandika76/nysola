// pages/api/faucet/run.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { processOneFaucetJob } from '../../../utils/faucetRunner';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const result = await processOneFaucetJob();
  res.status(200).json({ result });
}