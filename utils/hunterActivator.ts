// utils/hunterActivator.ts fix
import { db } from '../firebase';
import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { Wallet, JsonRpcProvider } from 'ethers';
import { evaluateHunterResult } from './evaluator';

const ALCHEMY_SEPOLIA_RPC = process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA_RPC!;

export async function activateHunterTasks() {
  const walletSnapshot = await getDocs(collection(db, 'wallets'));
  const missionSnapshot = await getDocs(collection(db, 'missionsProgress'));

  const wallets = walletSnapshot.docs.map((doc) => doc.data());

  const activeMissions = missionSnapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter((mission: any) => mission.completed === false);

  for (const walletData of wallets) {
    const wallet = new Wallet(walletData.privateKey, new JsonRpcProvider(ALCHEMY_SEPOLIA_RPC));

    for (const mission of activeMissions) {
      try {
        const tx = await wallet.sendTransaction({
          to: wallet.address,
          value: 0,
        });

        await tx.wait();

        await addDoc(collection(db, 'txHistory'), {
          walletAddress: wallet.address,
          txHash: tx.hash,
          status: 'success',
          timestamp: Timestamp.now(),
        });

        await evaluateHunterResult({
          walletAddress: wallet.address,
          txHash: tx.hash,
          missionId: mission.id,
          status: 'success',
        });
      } catch (error) {
        console.error(`❌ TX Error: ${wallet.address} - ${mission.id}`, error);

        await addDoc(collection(db, 'txHistory'), {
          walletAddress: wallet.address,
          txHash: '',
          status: 'failed',
          timestamp: Timestamp.now(),
        });

        await evaluateHunterResult({
          walletAddress: wallet.address,
          txHash: '',
          missionId: mission.id,
          status: 'failed',
        });
      }
    }
  }
}