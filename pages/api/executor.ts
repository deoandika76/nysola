// pages/api/executor.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { ethers } from 'ethers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const snapshot = await getDocs(collection(db, 'wallets'));
    const wallets = snapshot.docs.map((doc) => doc.data());

    const txResults: any[] = [];

    for (const wallet of wallets) {
      const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
      const signer = new ethers.Wallet(wallet.privateKey, provider);

      try {
        const tx = await signer.sendTransaction({
          to: wallet.address,
          value: ethers.parseEther('0.00001'),
        });

        await addDoc(collection(db, 'txHistory'), {
          walletAddress: wallet.address,
          txHash: tx.hash,
          status: 'success',
          timestamp: new Date(),
        });

        txResults.push({ address: wallet.address, status: 'success', txHash: tx.hash });
      } catch (err) {
        await addDoc(collection(db, 'txHistory'), {
          walletAddress: wallet.address,
          txHash: '',
          status: 'failed',
          timestamp: new Date(),
        });

        txResults.push({ address: wallet.address, status: 'failed', error: (err as any).message });
      }
    }

    res.status(200).json({ result: txResults });
  } catch (error) {
    console.error('[Executor Error]', error);
    res.status(500).json({ error: 'GAGAL EKSEKUSI TRANSAKSI' });
  }
}