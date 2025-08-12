// firebase.ts
import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  onSnapshot,
  DocumentData,
  Timestamp,
  query,
  orderBy,
  limit as fsLimit,
  where,
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

// === HEMAT KUOTA ===
// Ambil wallet dengan query + limit (default 2) biar gak get semua dokumen
export async function fetchWalletsLite(limitN = 2) {
  const q = query(collection(db, 'wallets'), orderBy('createdAt', 'desc'), fsLimit(limitN));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data() as any;
    return {
      address: data.address,
      privateKey: data.privateKey,
      createdAt: data.createdAt ?? { seconds: 0, nanoseconds: 0 },
    };
  });
}

// (legacy) Ambil semua wallet — HINDARI untuk cron
export async function fetchWallets() {
  const snapshot = await getDocs(collection(db, 'wallets'));
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      address: data.address,
      privateKey: data.privateKey,
      createdAt: data.createdAt ?? { seconds: 0, nanoseconds: 0 },
    };
  });
}

// Ambil semua transaksi (dipakai UI; tak diubah)
export async function fetchTxHistory(): Promise<
  { id: string; walletAddress: string; txHash: string; status: 'success' | 'failed'; timestamp: Timestamp }[]
> {
  const snapshot = await getDocs(collection(db, 'txHistory'));
  return snapshot.docs.map((doc) => {
    const data = doc.data() as any;
    return {
      id: doc.id,
      walletAddress: data.walletAddress ?? '',
      txHash: data.txHash ?? '',
      status: data.status ?? 'failed',
      timestamp: data.timestamp ?? Timestamp.now(),
    };
  });
}

// Realtime listeners (UI) — tidak diubah
export function listenToNotifications(callback: (data: DocumentData[]) => void) {
  const notifRef = collection(db, 'notifications');
  return onSnapshot(notifRef, (snapshot) => {
    const notifs = snapshot.docs.map((doc) => doc.data());
    callback(notifs);
  });
}

export function listenToTxHistory(callback: (
  data: { id: string; walletAddress: string; txHash: string; status: 'success' | 'failed'; timestamp: Timestamp }[]
) => void) {
  const txRef = collection(db, 'txHistory');
  return onSnapshot(txRef, (snapshot) => {
    const txs = snapshot.docs.map((doc) => {
      const data = doc.data() as any;
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
