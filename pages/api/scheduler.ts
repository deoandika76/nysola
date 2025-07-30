// redeploy trigger fix

import type { NextApiRequest, NextApiResponse } from 'next';
import { db, fetchWallets } from '../../firebase'; // ✅ Fix path
import { ethers } from 'ethers';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const secret = req.headers.authorization;
  if (secret !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
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
        });

        results.push({ wallet: wallet.address, status: 'success', txHash: tx.hash });
      } catch (err: any) {
        results.push({ wallet: wallet.address, status: 'failed', error: err.message });
      }
    }

    res.status(200).json({ message: 'Auto TX complete', results });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}