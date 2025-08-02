// utils/evaluator.ts
import { db } from '../firebase';
import { addDoc, collection, Timestamp } from 'firebase/firestore';

// ✅ Interface hasil evaluasi dari hunterActivator
export interface EvaluationResult {
  walletAddress: string;
  txHash: string;
  missionId: string;
  status: 'success' | 'failed';
}

// ✅ Fungsi untuk menyimpan hasil evaluasi hunter ke Firestore
export async function evaluateHunterResult(result: EvaluationResult) {
  try {
    await addDoc(collection(db, 'evaluations'), {
      ...result,
      evaluatedAt: Timestamp.now(),
    });
    console.log('✅ Evaluasi berhasil disimpan');
  } catch (err) {
    console.error('❌ Gagal menyimpan evaluasi:', err);
  }
}