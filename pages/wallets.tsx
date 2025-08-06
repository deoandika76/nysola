// pages/wallets.tsx
import { useEffect, useState } from 'react';
import { fetchWallets, fetchTxHistory } from '../firebase';
import FullLayout from '../components/FullLayout';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import WalletList from '../components/WalletList';
import GenerateWalletButton from '../components/GenerateWalletButton';
import { ethers } from 'ethers';

export default function WalletsPage() {
  const [wallets, setWallets] = useState<any[]>([]);
  const [txHistory, setTxHistory] = useState<any[]>([]);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [totalETH, setTotalETH] = useState(0);
  const [usdRate, setUsdRate] = useState(0);

  useEffect(() => {
    const load = async () => {
      const [walletsData, txData] = await Promise.all([
        fetchWallets(),
        fetchTxHistory(),
      ]);
      setWallets(walletsData);
      setTxHistory(txData);

      const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_SEPOLIA_RPC!);
      let total = 0;
      for (const wallet of walletsData) {
        const balance = await provider.getBalance(wallet.address);
        total += parseFloat(ethers.formatEther(balance));
      }
      setTotalETH(total);

      // ✅ Ambil rate ETH-USD (hardcoded sementara)
      try {
        const res = await fetch('https://api.coinbase.com/v2/exchange-rates?currency=ETH');
        const json = await res.json();
        const usd = parseFloat(json.data.rates.USD);
        setUsdRate(usd);
      } catch (e) {
        setUsdRate(3000); // fallback
      }
    };
    load();
  }, []);

  const totalTx = txHistory.length;
  const totalTasks = wallets.length * 3; // Placeholder (anggap tiap wallet 3 task done)

  return (
    <FullLayout title="Wallets - Nysola">
      <Header onToggleNavbar={() => setNavbarOpen(!navbarOpen)} />
      <Navbar isOpen={navbarOpen} onClose={() => setNavbarOpen(false)} />

      <div className="mt-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-cyan font-futuristic animate-fade-up">🧾 Wallet Management</h1>
          <GenerateWalletButton />
        </div>

        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6 mb-8">
          <StatCard title="💰 Total ETH" value={`${totalETH.toFixed(4)} ETH`} />
          <StatCard title="💵 Estimated USD" value={`$${(totalETH * usdRate).toFixed(2)}`} />
          <StatCard title="🔁 Total Transactions" value={totalTx.toString()} />
          <StatCard title="✅ Tasks Completed" value={totalTasks.toString()} />
        </div>

        <WalletList wallets={wallets} />
      </div>
    </FullLayout>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-[#111] rounded-xl p-4 border border-purple-700 shadow-xl">
      <p className="text-md text-gray-400">{title}</p>
      <h2 className="text-xl font-bold text-purple-300 mt-1">{value}</h2>
    </div>
  );
}