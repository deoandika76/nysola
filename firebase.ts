// firebase.ts
import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  DocumentData,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);

// 🔐 Ambil semua wallet dari koleksi `wallets`
export async function fetchWallets() {
  const snapshot = await getDocs(collection(db, 'wallets'));
  return snapshot.docs.map((doc) => doc.data() as { address: string; privateKey: string });
}

// 📡 Ambil histori transaksi dari koleksi `txHistory`
export async function fetchTxHistory(): Promise<
  {
    id: string;
    walletAddress: string;
    txHash: string;
    status: 'success' | 'failed';
    timestamp: any;
  }[]
//hehe haha
> {
  const snapshot = await getDocs(collection(db, 'txHistory'));
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      walletAddress: data.walletAddress,
      txHash: data.txHash,
      status: data.status,
      timestamp: data.timestamp,
    };
  });
}