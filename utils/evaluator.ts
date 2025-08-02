// utils/evaluator.ts
import { db } from '../firebase';
import { addDoc, collection, Timestamp } from 'firebase/firestore';

type EvaluationResult = {
  walletAddress: string;
  missionId: string;
  result: 'passed' | 'failed';
  feedback: string;
};

export async function evaluateHunterResult({
  walletAddress,
  missionId,
  result,
  feedback,
}: EvaluationResult): Promise<void> {
  try {
    await addDoc(collection(db, 'evaluations'), {
      walletAddress,
      missionId,
      result,
      feedback,
      timestamp: Timestamp.now(),
    });
    console.log(`✅ Evaluasi disimpan: ${walletAddress} - ${result}`);
  } catch (error) {
    console.error('❌ Gagal menyimpan evaluasi:', error);
    throw new Error('Gagal menyimpan evaluasi ke Firestore.');
  }
}