// firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, Timestamp } from 'firebase/firestore';
import { ethers } from 'ethers';

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCeCIq29L6vgE83reeqAh68Wd01jCF2BmA",
  authDomain: "nysola-62660.firebaseapp.com",
  projectId: "nysola-62660",
  storageBucket: "nysola-62660.appspot.com",
  messagingSenderId: "18232862863",
  appId: "1:18232862863:web:928cafcdf115e6d258a8fa"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Fungsi untuk generate wallet & simpan ke Firestore
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

// Fungsi untuk ambil semua wallet dari Firestore
export const fetchWallets = async () => {
  const querySnapshot = await getDocs(collection(db, 'wallets'));
  const wallets = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
  return wallets;
};