// utils/scheduler.ts
import { db, fetchWalletsLite } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { ethers } from 'ethers';
import axios from 'axios';

const MAX_PER_RUN = Number(process.env.CRON_MAX_PER_RUN || 2); // default 2 (hemat kuota)
const VALUE_ETH = '0.00001'; // kecil biar aman
const DUMMY_RECEIVER = '0x122CAa6b1cD0F4E3b30bfB85F22ec6c777Ee4c04';

export async function runScheduledTransactions() {
  // Ambil wallet secukupnya aja
  const wallets = await fetchWalletsLite(MAX_PER_RUN);
  const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_SEPOLIA_RPC!);
  const results: Array<{ address: string; txHash?: string; status: 'success' | 'failed'; error?: string }> = [];

  const liteMode = (process.env.FIREBASE_QUOTA_MODE || '').toLowerCase() === 'lite';

  for (const wallet of wallets) {
    try {
      const signer = new ethers.Wallet(wallet.privateKey, provider);
      const tx = await signer.sendTransaction({
        to: DUMMY_RECEIVER,
        value: ethers.parseEther(VALUE_ETH),
      });
      await tx.wait();

      // === WRITE MINIMAL ===
      // Catat hanya ke txHistory (1 write). autoTaskLogs opsional kalau tidak lite.
      await addDoc(collection(db, 'txHistory'), {
        from: wallet.address,
        to: DUMMY_RECEIVER,
        value: VALUE_ETH,
        txHash: tx.hash,
        timestamp: Timestamp.now(),
        status: 'success',
      });

      if (!liteMode) {
        await addDoc(collection(db, 'autoTaskLogs'), {
          walletAddress: wallet.address,
          txHash: tx.hash,
          timestamp: Timestamp.now(),
          status: 'success',
        });
      }

      // Notifikasi opsional via API (boleh di-skip di lite)
      if (!liteMode && process.env.NEXT_PUBLIC_BASE_URL) {
        try {
          await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/logNotification`, {
            message: `✅ Scheduler TX success: ${wallet.address} → ${tx.hash}`,
            type: 'success',
          }, { timeout: 2000 });
        } catch { /* ignore */ }
      }

      results.push({ address: wallet.address, txHash: tx.hash, status: 'success' });
    } catch (err: any) {
      const msg = err?.message || 'unknown error';

      if (!liteMode && process.env.NEXT_PUBLIC_BASE_URL) {
        try {
          await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/logNotification`, {
            message: `❌ Scheduler TX failed: ${wallet.address} → ${msg}`,
            type: 'error',
          }, { timeout: 2000 });
        } catch { /* ignore */ }
      }

      results.push({ address: wallet.address, error: msg, status: 'failed' });
    }
  }

  return results;
}
