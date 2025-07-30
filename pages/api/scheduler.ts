// pages/api/scheduler.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';
import { db, fetchWallets } from '@/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.headers.authorization !== process.env.CRON_SECRET) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

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

      results.push({ wallet: wallet.address, txHash: tx.hash });
    } catch (err: any) {
      results.push({ wallet: wallet.address, error: err.message });
    }
  }

  res.status(200).json({ message: 'Done', results });
}