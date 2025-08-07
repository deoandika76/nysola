// utils/executor.ts
import { ethers } from 'ethers';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { fetchWallets } from '../firebase';
import { filterActiveWallets, pickTarget } from './hunterAI';
import { evaluateHunterResult } from './evaluator';

const RPC_URL = process.env.NEXT_PUBLIC_SEPOLIA_RPC!;

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

    const gasPrice = tx.gasPrice ? tx.gasPrice.toString() : null;

    const txData = {
      walletAddress: wallet.address,
      txHash: tx.hash,
      status: 'success',
      timestamp: serverTimestamp(),
    };

    // ✅ Simpan log ke Firestore
    await addDoc(collection(db, 'txHistory'), txData);
    await addDoc(collection(db, 'notifications'), { ...txData, status: 'success' });
    await addDoc(collection(db, 'autoTaskLogs'), {
      ...txData,
      gasPrice: gasPrice || 'unknown',
      to: tx.to,
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
    const failData = {
      walletAddress: wallet.address,
      txHash: err?.transaction?.hash || 'ERROR',
      status: 'failed',
      timestamp: serverTimestamp(),
    };

    await addDoc(collection(db, 'txHistory'), failData);
    await addDoc(collection(db, 'notifications'), { ...failData, status: 'failed' });
    await addDoc(collection(db, 'autoTaskLogs'), {
      ...failData,
      reason: err?.message || 'Unknown error',
    });

    return `❌ TX Failed: ${err?.message}`;
  }
}