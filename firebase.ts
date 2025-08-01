// firebase.ts
import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  onSnapshot,
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

// ✅ Init Firebase app
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);

// 🔄 Optional Exports Lain Tetap Sama
export async function fetchWallets() {
  const snapshot = await getDocs(collection(db, 'wallets'));
  return snapshot.docs.map((doc) => doc.data() as { address: string; privateKey: string });
}

export async function fetchTxHistory() {
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

export function listenToNotifications(callback: (data: DocumentData[]) => void) {
  const notifRef = collection(db, 'notifications');
  return onSnapshot(notifRef, (snapshot) => {
    const notifs = snapshot.docs.map((doc) => doc.data());
    callback(notifs);
  });
}