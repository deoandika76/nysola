import { NextApiRequest, NextApiResponse } from 'next';
import { db, fetchWallets } from '../../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { ethers } from 'ethers';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  const authHeader = req.headers.authorization;
  const validSecret = `Bearer ${process.env.CRON_SECRET}`;
  if (authHeader !== validSecret) {
    return res.status(401).end('Unauthorized');
  }

  try {
    const wallets = await fetchWallets();
    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_SEPOLIA_RPC!);
    const dummyReceiver = '0x122CAa6b1cD0F4E3b30bfB85F22ec6c777Ee4c04';
    const results = [];

    for (const wallet of wallets) {
      try {
        const signer = new ethers.Wallet(wallet.privateKey, provider);
        const tx = await signer.sendTransaction({
          to: dummyReceiver,
          value: ethers.parseEther('0.0001'),
        });

        await tx.wait();

        await addDoc(collection(db, 'autoTaskLogs'), {
          walletAddress: wallet.address,
          txHash: tx.hash,
          timestamp: Timestamp.now(),
          status: 'success',
        });

        await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/logNotification`, {
          message: `✅ TX success - ${wallet.address} → ${tx.hash}`,
          type: 'success',
        });

        results.push({ address: wallet.address, txHash: tx.hash, status: 'success' });
      } catch (err: any) {
        await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/logNotification`, {
          message: `❌ TX failed - ${wallet.address} → ${err.message}`,
          type: 'error',
        });

        results.push({ address: wallet.address, error: err.message, status: 'failed' });
      }
    }

    return res.status(200).json({ results });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}