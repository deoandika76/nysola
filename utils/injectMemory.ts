// utils/injectMemory.ts
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

export async function getGodEyeMemory() {
  let memory = '';

  // 1. Hunter Missions Progress
  const missionsSnap = await getDocs(collection(db, 'missionsProgress'));
  const doneCount = missionsSnap.docs.filter((doc) => doc.data().done).length;
  memory += `📌 Hunter Mission Completed: ${doneCount} dari 30\n`;

  // 2. Jumlah Wallet & Estimasi Reward
  const walletsSnap = await getDocs(collection(db, 'wallets'));
  memory += `💼 Jumlah Wallet Tersimpan: ${walletsSnap.size}\n`;

  // 3. Status Task Terakhir
  const txSnap = await getDocs(collection(db, 'txHistory'));
  const success = txSnap.docs.filter((doc) => doc.data().status === 'success').length;
  const failed = txSnap.docs.filter((doc) => doc.data().status === 'failed').length;
  memory += `📊 Task Summary: ${success} sukses, ${failed} gagal\n`;

  return memory;
}