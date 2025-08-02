// firebase.ts
import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  onSnapshot,
  Timestamp,
  type DocumentData // ✅ <- di sini pakai `type`
} from 'firebase/firestore';

// Konfigurasi dari .env
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// Init app
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

// ✅ Export fungsi dan konstanta
export {
  db,
  collection,
  getDocs,
  onSnapshot,
  Timestamp,
};

export type { DocumentData };

// 📥 Ambil semua wallet dari koleksi `wallets`
export async function fetchWallets() {
  const snapshot = await getDocs(collection(db, 'wallets'));
  return snapshot.docs.map((doc) => doc.data() as { address: string; privateKey: string });
}