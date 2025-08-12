// pages/api/faucet/queue.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { enqueueFaucetJob } from '@/utils/faucetRunner';
import { FaucetChain, supportedChains } from '@/utils/faucetAdapters';

const alias: Record<string, FaucetChain> = {
  sepolia: 'sepolia',
  base: 'base-sepolia',
  'base-sepolia': 'base-sepolia',
  arb: 'arbitrum-sepolia',
  'arbitrum-sepolia': 'arbitrum-sepolia',
  op: 'optimism-sepolia',
  'optimism-sepolia': 'optimism-sepolia',
  scroll: 'scroll-sepolia',
  'scroll-sepolia': 'scroll-sepolia',
  zeta: 'zeta-testnet',
  'zeta-testnet': 'zeta-testnet',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST allowed' });

  const { wallet, chain } = req.body as { wallet?: string; chain?: string };
  if (!wallet || !chain) return res.status(400).json({ error: 'wallet & chain required' });

  const normalized = alias[String(chain).toLowerCase()];
  if (!normalized || !supportedChains.includes(normalized)) {
    return res.status(400).json({ error: 'unsupported chain' });
  }

  await enqueueFaucetJob({ wallet, chain: normalized });
  return res.status(200).json({ ok: true, message: 'Queued' });
}