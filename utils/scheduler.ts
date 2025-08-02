// utils/scheduler.ts
import { db, fetchWallets } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { ethers } from 'ethers';
import axios from 'axios';

export async function runScheduledTransactions() {
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

      await addDoc(collection(db, 'autoTaskLogs'), {
        walletAddress: wallet.address,
        txHash: tx.hash,
        timestamp: Timestamp.now(),
        status: 'success',
      });

      await addDoc(collection(db, 'txHistory'), {
        from: wallet.address,
        to: dummyReceiver,
        value: '0.0001',
        txHash: tx.hash,
        createdAt: Timestamp.now(),
        status: 'success',
      });

      await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/logNotification`, {
        message: `✅ Scheduler TX success: ${wallet.address} → ${tx.hash}`,
        type: 'success',
      });

      results.push({ address: wallet.address, txHash: tx.hash, status: 'success' });
    } catch (err: any) {
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/logNotification`, {
        message: `❌ Scheduler TX failed: ${wallet.address} → ${err.message}`,
        type: 'error',
      });

      results.push({ address: wallet.address, error: err.message, status: 'failed' });
    }
  }

  return results;
}