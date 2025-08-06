// components/GenerateWalletButton.tsx
import { db } from '../firebase';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { ethers } from 'ethers';
import { useState } from 'react';

export default function GenerateWalletButton() {
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    const walletCol = collection(db, 'wallets');
    for (let i = 0; i < count; i++) {
      const wallet = ethers.Wallet.createRandom();
      await addDoc(walletCol, {
        address: wallet.address,
        privateKey: wallet.privateKey,
        createdAt: Timestamp.now(),
      });
    }
    setLoading(false);
    window.location.reload();
  };

  return (
    <div className="flex items-center space-x-3">
      <input
        type="number"
        min="1"
        max="100"
        value={count}
        onChange={(e) => setCount(Number(e.target.value))}
        className="w-16 bg-black text-white border border-gray-500 px-2 py-1 rounded"
      />
      <button
        disabled={loading}
        onClick={generate}
        className="bg-purple-600 hover:bg-purple-800 text-white px-4 py-2 rounded-lg font-bold transition"
      >
        ⚡ Generate {count} Wallet{count > 1 ? 's' : ''}
      </button>
    </div>
  );
}