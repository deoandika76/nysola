// utils/executor.ts
import db from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { Wallet, JsonRpcProvider } from 'ethers';

const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL!);

export async function executeHunterTask(wallet: { address: string; privateKey: string }) {
  try {
    const sender = new Wallet(wallet.privateKey, provider);
    const tx = await sender.sendTransaction({
      to: sender.address,
      value: BigInt(1), // kirim kecil buat test
    });

    const result = await tx.wait();

    await addDoc(collection(db, 'txHistory'), {
      walletAddress: wallet.address,
      txHash: result.transactionHash,
      status: 'success',
      timestamp: Timestamp.now(),
    });

    return { success: true, hash: result.transactionHash };
  } catch (err) {
    await addDoc(collection(db, 'txHistory'), {
      walletAddress: wallet.address,
      txHash: 'ERROR',
      status: 'failed',
      timestamp: Timestamp.now(),
    });

    return { success: false };
  }
}