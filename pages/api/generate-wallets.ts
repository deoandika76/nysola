// pages/api/generate-wallet.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';
import { db } from '../../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method not allowed');

  const wallet = ethers.Wallet.createRandom();
  
  const walletData = {
    address: wallet.address,
    privateKey: wallet.privateKey,
    createdAt: Timestamp.now()
  };

  try {
    await addDoc(collection(db, 'wallets'), walletData);
    res.status(200).json({ message: 'Wallet generated and stored!', wallet: walletData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to store wallet' });
  }
}