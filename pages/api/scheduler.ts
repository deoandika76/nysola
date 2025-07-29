// pages/api/scheduler.ts ( nysola wkwk )

import type { NextApiRequest, NextApiResponse } from 'next';
import { db, fetchWallets } from '@/firebase';
import { ethers } from 'ethers';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Only GET method allowed' });
  }

  try {
    const wallets = await fetchWallets();
    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_SEPOLIA_RPC!);
    const dummyReceiver = '0x122CAa6b1cD0F4E3b30bfB85F22ec6c777Ee4c04';

    const results: any[] = [];

    for (const wallet of wallets) {
      try {
        const signer = new ethers.Wallet(wallet.privateKey, provider);
        const tx = await signer.sendTransaction({
          to: dummyReceiver,
          value: ethers.parseEther('0.0001'),
        });

        await tx.wait();

        await addDoc(collection(db, 'txHistory'), {
          from: wallet.address,
          to: dummyReceiver,
          value: '0.0001',
          txHash: tx.hash,
          createdAt: Timestamp.now(),
          via: 'scheduler',
        });

        results.push({ address: wallet.address, txHash: tx.hash, status: 'success' });
      } catch (err: any) {
        results.push({ address: wallet.address, error: err.message, status: 'failed' });
      }
    }

    res.status(200).json({ message: 'Scheduler executed', results });
  } catch (err: any) {
    res.status(500).json({ message: 'Scheduler failed', error: err.message });
  }
}