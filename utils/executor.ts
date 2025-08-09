// utils/executor.ts /redeploy
import { ethers } from 'ethers';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { fetchWallets } from '../firebase';
import { filterActiveWallets, pickTarget } from './hunterAI';
import { evaluateHunterResult } from './evaluator';

const RPC_URL = process.env.NEXT_PUBLIC_SEPOLIA_RPC!;

// cache sederhana untuk mencegah spam notifikasi duplikat pada proses yang sama
const notifCache: Set<string> =
  (globalThis as any).__nysolaNotifCache || new Set<string>();
(globalThis as any).__nysolaNotifCache = notifCache;

export async function executeAutoTask() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallets = await fetchWallets();
  const activeWallets = await filterActiveWallets(wallets, provider);
  const target = pickTarget(activeWallets);

  if (!target) return '❌ No target wallet found';

  const wallet = new ethers.Wallet(target.privateKey, provider);

  try {
    const tx = await wallet.sendTransaction({
      to: '0x122CAa6b1cD0F4E3b30bfB85F22ec6c777Ee4c04',
      value: ethers.parseEther('0.00001'),
    });

    const txData = {
      walletAddress: wallet.address,
      txHash: tx.hash,
      status: 'success' as const,
      timestamp: serverTimestamp(),
    };

    // ✅ Simpan log minimalis untuk hemat kuota
    await addDoc(collection(db, 'txHistory'), txData);

    // ✅ Notif: dedup agar tidak double write
    const key = `${wallet.address}:${tx.hash}:success`;
    if (!notifCache.has(key)) {
      await addDoc(collection(db, 'notifications'), {
        message: `TX sent ${tx.hash.slice(0, 10)}…`,
        type: 'success',
        timestamp: serverTimestamp(),
      });
      notifCache.add(key);
    }

    // ✅ AutoTaskLogs minimal
    await addDoc(collection(db, 'autoTaskLogs'), {
      w: wallet.address,
      h: tx.hash,
      t: serverTimestamp(),
    });

    // ✅ Evaluasi hasil hunter
    await evaluateHunterResult({
      walletAddress: wallet.address,
      txHash: tx.hash,
      missionId: 'TX-GOD-EYE',
      status: 'success',
    });

    return `✅ TX Sent: ${tx.hash}`;
  } catch (err: any) {
    const message = err?.message || 'Unknown error';
    const txHash = err?.transaction?.hash || 'ERROR';

    const failData = {
      walletAddress: wallet.address,
      txHash,
      status: 'failed' as const,
      timestamp: serverTimestamp(),
    };

    await addDoc(collection(db, 'txHistory'), failData);

    const key = `${wallet.address}:${txHash}:failed`;
    if (!notifCache.has(key)) {
      await addDoc(collection(db, 'notifications'), {
        message: `TX failed (${message.slice(0, 120)})`,
        type: 'error',
        timestamp: serverTimestamp(),
      });
      notifCache.add(key);
    }

    await addDoc(collection(db, 'autoTaskLogs'), {
      w: wallet.address,
      h: txHash,
      err: message.slice(0, 200),
      t: serverTimestamp(),
    });

    return `❌ TX Failed: ${message}`;
  }
}