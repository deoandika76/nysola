// pages/api/taskSelector.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { fetchWallets } from '../../firebase';
import { Wallet } from '../../types';

/**
 * Filter wallet aktif berdasarkan kriteria dummy.
 * Di sini kita pakai random buat simulasi aktif/nonaktif.
 * Nanti bisa lo ganti jadi real data analytics.
 */
function filterActiveWallets(wallets: Wallet[]): Wallet[] {
  return wallets.filter(() => Math.random() > 0.5); // 50% chance aktif (dummy)
}

/**
 * Pilih target wallet untuk AI Task.
 * Contoh: ambil 3 wallet pertama dari list yang aktif
 */
function selectTargetWallets(activeWallets: Wallet[], count = 3): Wallet[] {
  return activeWallets.slice(0, count);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Only GET allowed' });
  }

  try {
    const wallets = await fetchWallets();
    const activeWallets = filterActiveWallets(wallets);
    const targetWallets = selectTargetWallets(activeWallets);

    return res.status(200).json({
      totalWallets: wallets.length,
      activeWallets: activeWallets.length,
      selectedTargets: targetWallets,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}