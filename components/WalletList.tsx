import { useState } from 'react';

type Wallet = {
  address: string;
  privateKey: string;
  createdAt: string;
};

export default function WalletList({ wallets }: { wallets: Wallet[] }) {
  return (
    <div className="space-y-4">
      {wallets.map((wallet, index) => (
        <WalletItem key={index} wallet={wallet} />
      ))}
    </div>
  );
}

function WalletItem({ wallet }: { wallet: Wallet }) {
  const [show, setShow] = useState(false);

  return (
    <div className="border p-4 rounded-lg text-white bg-black border-violet-500">
      <p>🔗 <b>Address:</b> {wallet.address}</p>
      <p>
        🔑 <b>Private Key:</b>{" "}
        {show ? wallet.privateKey : '••••••••••••••••••••••'}
        <button
          onClick={() => setShow(!show)}
          className="ml-2 text-sm text-violet-400 hover:underline"
        >
          {show ? "Sembunyikan" : "Tampilkan"}
        </button>
      </p>
      <p>🕓 <b>Dibuat:</b> {wallet.createdAt}</p>
    </div>
  );
}