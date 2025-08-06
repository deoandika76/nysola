// pages/api/autoTask.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';
import { db, fetchWallets } from '@/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
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

        // ✅ Simpan ke autoTaskLogs
        await addDoc(collection(db, 'autoTaskLogs'), {
          walletAddress: wallet.address,
          txHash: tx.hash,
          timestamp: Timestamp.now(),
          status: 'success',
        });

        // ✅ Simpan ke txHistory DENGAN STRUKTUR BENAR!
        await addDoc(collection(db, 'txHistory'), {
          walletAddress: wallet.address, // penting!
          txHash: tx.hash,
          status: 'success',
          timestamp: Timestamp.now(),
        });

        results.push({ address: wallet.address, txHash: tx.hash, status: 'success' });

      } catch (err: any) {
        // ✅ Tetap simpan txHistory failed biar dashboard akurat
        await addDoc(collection(db, 'txHistory'), {
          walletAddress: wallet.address,
          txHash: '',
          status: 'failed',
          timestamp: Timestamp.now(),
        });

        results.push({ address: wallet.address, error: err.message, status: 'failed' });
      }
    }

    return res.status(200).json({ message: 'Auto task executed', results });
  } catch (err: any) {
    return res.status(500).json({ message: 'Auto task failed', error: err.message });
  }
}