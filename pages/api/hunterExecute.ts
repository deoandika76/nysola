// pages/api/hunterExecute.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';
import { db } from '../../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import axios from 'axios';
import selectedTargetsJson from '../../data/taskSelector.json';
import { Wallet } from '../../types';

interface SelectedTargets {
  selectedTargets: Wallet[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const startTime = Date.now();

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  try {
    const { selectedTargets } = selectedTargetsJson as SelectedTargets;

    if (!Array.isArray(selectedTargets) || selectedTargets.length === 0) {
      return res.status(400).json({ message: 'No selected wallets found' });
    }

    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_SEPOLIA_RPC!);
    const dummyReceiver = '0x122CAa6b1cD0F4E3b30bfB85F22ec6c777Ee4c04';
    const results = [];

    for (const wallet of selectedTargets) {
      if (!wallet.address || !wallet.privateKey) {
        results.push({ address: wallet.address || 'N/A', error: 'Missing wallet data', status: 'skipped' });
        continue;
      }

      try {
        const signer = new ethers.Wallet(wallet.privateKey, provider);
        const tx = await signer.sendTransaction({
          to: dummyReceiver,
          value: ethers.parseEther('0.0001'),
        });

        await tx.wait();

        await addDoc(collection(db, 'hunterLogs'), {
          walletAddress: wallet.address,
          txHash: tx.hash,
          timestamp: Timestamp.now(),
          status: 'success',
        });

        await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/logNotification`, {
          message: `✅ Hunter TX success - ${wallet.address} → ${tx.hash}`,
          type: 'success',
        });

        results.push({ address: wallet.address, txHash: tx.hash, status: 'success' });
      } catch (txErr: any) {
        await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/logNotification`, {
          message: `❌ Hunter TX failed - ${wallet.address} → ${txErr.message}`,
          type: 'error',
        });

        results.push({ address: wallet.address, error: txErr.message, status: 'failed' });
      }
    }

    const timeTaken = Date.now() - startTime;
    return res.status(200).json({ total: selectedTargets.length, timeMs: timeTaken, results });

  } catch (err: any) {
    return res.status(500).json({ error: 'Internal error: ' + err.message });
  }
}