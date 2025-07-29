// pages/api/scheduler.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { db, fetchWallets } from '@/firebase';
import { ethers } from 'ethers';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST method allowed' });
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
          value: ethers.parseEther('0.00005'),
        });

        await tx.wait();

        await addDoc(collection(db, 'txHistory'), {
          from: wallet.address,
          to: dummyReceiver,
          value: '0.00005',
          txHash: tx.hash,
          createdAt: Timestamp.now(),
        });

        results.push({ address: wallet.address, txHash: tx.hash, status: 'success' });
      } catch (error: any) {
        results.push({ address: wallet.address, error: error.message, status: 'failed' });
      }
    }

    res.status(200).json({ message: 'Scheduled task done', results });
  } catch (error: any) {
    res.status(500).json({ message: 'Scheduler failed', error: error.message });
  }
}