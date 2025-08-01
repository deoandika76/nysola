// utils/evaluator.ts
import { db } from '../firebase';
import { addDoc, collection, Timestamp } from 'firebase/firestore';

export async function evaluateHunterResult({
  walletAddress,
  txHash,
  rewardFound,
}: {
  walletAddress: string;
  txHash: string;
  rewardFound: boolean;
}) {
  if (rewardFound) {
    await addDoc(collection(db, 'rewards'), {
      walletAddress,
      txHash,
      amount: 'TestReward',
      timestamp: Timestamp.now(),
    });
  }

  return rewardFound ? '✅ Reward tercatat' : '❌ Tidak ada reward';
}