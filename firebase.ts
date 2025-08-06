// firebase.ts
import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  onSnapshot,
  DocumentData,
  Timestamp,
} from 'firebase/firestore';

// 🔐 Konfigurasi dari environment variable
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// ✅ Inisialisasi Firebase App (jangan dobel)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);

// ✅ Ambil semua wallet
export async function fetchWallets() {
  const snapshot = await getDocs(collection(db, 'wallets'));
  return snapshot.docs.map((doc) => doc.data() as { address: string; privateKey: string });
}

// ✅ Ambil semua transaksi dari txHistory
export async function fetchTxHistory(): Promise<
  {
    id: string;
    walletAddress: string;
    txHash: string;
    status: 'success' | 'failed';
    timestamp: Timestamp;
  }[]
> {
  const snapshot = await getDocs(collection(db, 'txHistory'));
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      walletAddress: data.walletAddress ?? '',
      txHash: data.txHash ?? '',
      status: data.status ?? 'failed',
      timestamp: data.timestamp ?? Timestamp.now(),
    };
  });
}

// ✅ Listener realtime untuk notifikasi
export function listenToNotifications(callback: (data: DocumentData[]) => void) {
  const notifRef = collection(db, 'notifications');
  return onSnapshot(notifRef, (snapshot) => {
    const notifs = snapshot.docs.map((doc) => doc.data());
    callback(notifs);
  });
}

// ✅ Listener realtime untuk transaksi di dashboard
export function listenToTxHistory(callback: (
  data: {
    id: string;
    walletAddress: string;
    txHash: string;
    status: 'success' | 'failed';
    timestamp: Timestamp;
  }[]
) => void) {
  const txRef = collection(db, 'txHistory');
  return onSnapshot(txRef, (snapshot) => {
    const txs = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        walletAddress: data.walletAddress ?? '',
        txHash: data.txHash ?? '',
        status: data.status ?? 'failed',
        timestamp: data.timestamp ?? Timestamp.now(),
      };
    });
    callback(txs);
  });
}