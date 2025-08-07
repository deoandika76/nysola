// utils/evaluator.ts
import { db } from '../firebase';
import {
  addDoc,
  collection,
  Timestamp,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

export interface EvaluationResult {
  walletAddress: string;
  txHash: string;
  missionId: string;
  status: 'success' | 'failed';
}

export async function evaluateHunterResult(result: EvaluationResult) {
  try {
    // Simpan hasil evaluasi
    await addDoc(collection(db, 'evaluations'), {
      ...result,
      evaluatedAt: Timestamp.now(),
    });

    console.log('✅ Evaluasi berhasil disimpan');

    // Jika sukses, lanjut cek dan catat reward
    if (result.status === 'success') {
      const rewardAmount = '0.0025'; // bisa disesuaikan
      const rewardData = {
        walletAddress: result.walletAddress,
        token: 'ETH',
        amount: rewardAmount,
        txHash: result.txHash,
        status: 'success',
        timestamp: Timestamp.now(),
      };

      // Cek apakah reward sudah ada sebelumnya (hindari duplikat)
      const existing = await getDocs(
        query(
          collection(db, 'rewards'),
          where('txHash', '==', result.txHash)
        )
      );

      if (existing.empty) {
        await addDoc(collection(db, 'rewards'), rewardData);
        await addDoc(collection(db, 'notifications'), {
          ...rewardData,
          type: 'reward',
          message: `🎁 Wallet ${result.walletAddress} berhasil mendapatkan ${rewardAmount} ETH.`,
        });

        console.log('🎉 Reward berhasil dicatat');
      } else {
        console.log('⚠️ Reward sudah pernah dicatat sebelumnya');
      }
    }
  } catch (err) {
    console.error('❌ Gagal evaluasi & simpan reward:', err);
  }
}