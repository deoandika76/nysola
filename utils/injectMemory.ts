// utils/injectMemory.ts
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

export async function buildGodEyeMemory() {
  try {
    const [walletSnap, rewardSnap, missionSnap] = await Promise.all([
      getDocs(collection(db, 'wallets')),
      getDocs(collection(db, 'rewards')).catch(() => ({ docs: [] })), // opsional
      getDocs(collection(db, 'hunterMissions')).catch(() => ({ docs: [] })),
    ]);

    const wallets = walletSnap.docs.map((doc) => doc.data());
    const rewards = rewardSnap.docs.map((doc) => doc.data());
    const missions = missionSnap.docs.map((doc) => doc.data());

    const walletList = wallets.map((w) => w.address).join(', ') || 'Tidak ada';
    const totalReward = rewards.length || 0;
    const missionStatus = missions.length
      ? missions.map((m, i) => `#${i + 1}: ${m.title || 'Tanpa Judul'} → ${m.status || 'Belum Dikerjakan'}`).join(' | ')
      : 'Belum ada misi yang tercatat';

    const memoryContext = 
      `🧠 GOD EYE CONTEXT:\n` +
      `📦 Wallet Aktif: ${walletList}\n` +
      `🎁 Total Reward Masuk: ${totalReward}\n` +
      `🎯 Status Misi Hunter: ${missionStatus}\n`;

    return memoryContext;
  } catch (error) {
    console.error('❌ Gagal membuat context memory:', error);
    return 'Gagal mengambil data dari Firestore.';
  }
}