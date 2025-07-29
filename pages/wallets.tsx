import { useEffect, useState } from 'react';
import { db } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';
import WalletList from '@/components/WalletList';

type Wallet = {
  address: string;
  privateKey: string;
  createdAt: string;
};

export default function WalletsPage() {
  const [wallets, setWallets] = useState<Wallet[]>([]);

  useEffect(() => {
    const fetchWallets = async () => {
      const snapshot = await getDocs(collection(db, 'wallets'));
      const data = snapshot.docs.map((doc) => {
        const w = doc.data();
        return {
          address: w.address,
          privateKey: w.privateKey,
          createdAt: new Date(w.createdAt.seconds * 1000).toLocaleString('id-ID'),
        };
      });
      setWallets(data);
    };

    fetchWallets();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-violet-500 mb-4">📃 Wallet List</h1>
      <WalletList wallets={wallets} />
    </div>
  );
}