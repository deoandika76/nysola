// pages/api/hunterExecute.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { Wallet as EthersWallet, JsonRpcProvider } from 'ethers';
import { evaluateHunterResult } from '@/utils/evaluator';
import axios from 'axios';
import selectedTargetsJson from '@/data/taskSelector.json';
import { Wallet } from '@/types';
import { ALCHEMY_SEPOLIA_RPC } from '@/utils/config';

interface SelectedTargets {
  selectedTargets: Wallet[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const start = Date.now();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  try {
    const { selectedTargets } = selectedTargetsJson as SelectedTargets;

    if (!Array.isArray(selectedTargets) || selectedTargets.length === 0) {
      return res.status(400).json({ error: 'No wallets selected for execution' });
    }

    const provider = new JsonRpcProvider(ALCHEMY_SEPOLIA_RPC);
    const dummyReceiver = '0x122CAa6b1cD0F4E3b30bfB85F22ec6c777Ee4c04';
    const results = [];

    for (const wallet of selectedTargets) {
      if (!wallet.address || !wallet.privateKey) {
        results.push({ address: wallet.address || 'N/A', error: 'Missing wallet data', status: 'skipped' });
        continue;
      }

      try {
        const signer = new EthersWallet(wallet.privateKey, provider);
        const tx = await signer.sendTransaction({
          to: dummyReceiver,
          value: BigInt(1e14), // 0.0001 ETH
        });

        await tx.wait();

        await addDoc(collection(db, 'hunterLogs'), {
          walletAddress: wallet.address,
          txHash: tx.hash,
          timestamp: Timestamp.now(),
          status: 'success',
        });

        await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/logNotification`, {
          message: `✅ Hunter TX success: ${wallet.address} → ${tx.hash}`,
          type: 'success',
        });

        await evaluateHunterResult({
          walletAddress: wallet.address,
          txHash: tx.hash,
          missionId: 'manual-trigger',
          status: 'success',
        });

        results.push({ address: wallet.address, txHash: tx.hash, status: 'success' });

      } catch (err: any) {
        await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/logNotification`, {
          message: `❌ Hunter TX failed: ${wallet.address} → ${err.message}`,
          type: 'error',
        });

        results.push({ address: wallet.address, error: err.message, status: 'failed' });
      }
    }

    return res.status(200).json({
      message: 'Execution completed',
      total: selectedTargets.length,
      timeMs: Date.now() - start,
      results,
    });
  } catch (err: any) {
    console.error('[hunterExecute] Error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}