// utils/executor.ts
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { Wallet, JsonRpcProvider } from 'ethers';

interface WalletData {
  address: string;
  privateKey: string;
}

const RPC_URL = process.env.NEXT_PUBLIC_SEPOLIA_RPC!;
const provider = new JsonRpcProvider(RPC_URL);

export async function runTransaction(wallet: WalletData) {
  try {
    const signer = new Wallet(wallet.privateKey, provider);

    const tx = {
      to: wallet.address, // kirim ke diri sendiri (dummy tx)
      value: BigInt(1),   // 1 wei
    };

    const result = await signer.sendTransaction(tx);

    if (result && result.hash) {
      await addDoc(collection(db, 'txHistory'), {
        walletAddress: wallet.address,
        txHash: result.hash,
        status: 'success',
        timestamp: Timestamp.now(),
      });
    } else {
      await addDoc(collection(db, 'txHistory'), {
        walletAddress: wallet.address,
        txHash: '❌ No tx hash',
        status: 'failed',
        timestamp: Timestamp.now(),
      });
    }

    return result;
  } catch (error) {
    await addDoc(collection(db, 'txHistory'), {
      walletAddress: wallet.address,
      txHash: '❌ Error saat kirim tx',
      status: 'failed',
      timestamp: Timestamp.now(),
    });

    console.error('Gagal kirim transaksi:', error);
    return null;
  }
}