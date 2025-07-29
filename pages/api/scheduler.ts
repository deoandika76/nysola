// pages/api/scheduler.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db, fetchWallets } from '@/firebase';
import { ethers } from 'ethers';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_SEPOLIA_RPC!);
    const dummyReceiver = '0x122CAa6b1cD0F4E3b30bfB85F22ec6c777Ee4c04';
    const wallets = await fetchWallets();

    const results = [];

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
          txHash: tx.hash,
          value: '0.0001',
          createdAt: Timestamp.now(),
        });

        results.push({ address: wallet.address, status: 'success', hash: tx.hash });
      } catch (err: any) {
        results.push({ address: wallet.address, status: 'failed', error: err.message });
      }
    }

    res.status(200).json({ message: 'Scheduled task executed', results });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}