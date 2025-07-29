// firebase.ts

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, Timestamp } from 'firebase/firestore';
import { ethers } from 'ethers';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Generate wallet dan simpan ke Firestore
export const generateWallet = async () => {
  const wallet = ethers.Wallet.createRandom();

  const walletData = {
    address: wallet.address,
    privateKey: wallet.privateKey,
    createdAt: Timestamp.now(),
  };

  await addDoc(collection(db, 'wallets'), walletData);
  return walletData;
};

// Ambil semua wallet dari Firestore (fix TypeScript)
export const fetchWallets = async () => {
  const snapshot = await getDocs(collection(db, 'wallets'));
  const wallets = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      address: data.address,
      privateKey: data.privateKey,
      createdAt: data.createdAt,
    };
  });
  return wallets;
};