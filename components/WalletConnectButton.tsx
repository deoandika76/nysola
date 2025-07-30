// components/WalletConnectButton.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { connectWithMetamask } from '../utils/walletConnect';

export default function WalletConnectButton() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('nysola-wallet');
    if (saved) setWalletAddress(saved);
  }, []);

  const handleConnect = async () => {
    setConnecting(true);
    const address = await connectWithMetamask();
    if (address) {
      localStorage.setItem('nysola-wallet', address);
      setWalletAddress(address);

      // ✅ Simpan auth ke cookie (biar middleware detect)
      document.cookie = 'nysola-auth=true; path=/';

      // ✅ Redirect ke dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    }
    setConnecting(false);
  };

  return (
    <div className="flex flex-col items-start space-y-2">
      {walletAddress ? (
        <p className="text-green-400 font-mono text-sm">
          ✅ Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
        </p>
      ) : (
        <button
          onClick={handleConnect}
          disabled={connecting}
          className="bg-cyan hover:bg-orchid text-black font-bold px-6 py-2 rounded-xl transition-all"
        >
          {connecting ? '⏳ Connecting...' : '🔌 Connect Wallet'}
        </button>
      )}
    </div>
  );
}