// pages/faucet-hunter.tsx/
import { useEffect, useState } from 'react';
import FullLayout from '@/components/FullLayout';
import { fetchWallets } from '@/firebase';
import { supportedChains, FaucetChain } from '@/utils/faucetAdapters';

type W = { address: string };

export default function FaucetHunterPage() {
  const [wallets, setWallets] = useState<W[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<string>('');
  const [selectedChain, setSelectedChain] = useState<FaucetChain>('sepolia');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string>('');

  useEffect(() => {
    (async () => {
      try {
        const wl = await fetchWallets();
        setWallets(wl);
        if (wl.length > 0) setSelectedWallet(wl[0].address);
      } catch (e: any) {
        setMsg(`Gagal load wallets: ${e?.message || e}`);
      }
    })();
  }, []);

  const enqueue = async () => {
    if (!selectedWallet) {
      setMsg('Pilih wallet dulu.');
      return;
    }
    setLoading(true);
    setMsg('');
    try {
      const res = await fetch('/api/enqueue-faucet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chain: selectedChain,
          wallet: selectedWallet,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'enqueue_failed');

      setMsg(`✅ Enqueued: ${selectedChain} → ${selectedWallet.slice(0, 6)}...`);
    } catch (e: any) {
      setMsg(`❌ Enqueue error: ${e?.message || e}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FullLayout title="Faucet Hunter">
      <h1 className="text-3xl font-bold text-cyan text-center mb-8">🚰 Faucet Hunter</h1>

      <div className="max-w-2xl mx-auto space-y-5 bg-black/40 backdrop-blur-md border border-violet-500/40 rounded-xl p-6">
        {/* Wallet select */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Wallet</label>
          <select
            value={selectedWallet}
            onChange={(e) => setSelectedWallet(e.target.value)}
            className="w-full bg-black/50 border border-gray-700 rounded-lg p-2 text-white"
          >
            {wallets.map((w) => (
              <option key={w.address} value={w.address}>
                {w.address}
              </option>
            ))}
          </select>
        </div>

        {/* Chain select */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Chain (Testnet)</label>
          <select
            value={selectedChain}
            onChange={(e) => setSelectedChain(e.target.value as FaucetChain)}
            className="w-full bg-black/50 border border-gray-700 rounded-lg p-2 text-white"
          >
            {supportedChains.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={enqueue}
            disabled={loading || !selectedWallet}
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {loading ? 'Queuing…' : '➕ Enqueue Faucet Job'}
          </button>

          <a
            href="/api/cron-execute?run=faucet"
            className="text-cyan underline hover:text-cyan-300"
            title="Trigger worker sekali (manual)"
          >
            Run 1 Job (Manual)
          </a>
        </div>

        {/* Message */}
        {msg && (
          <div className="text-sm text-gray-200 bg-black/40 border border-gray-700 rounded p-3">
            {msg}
          </div>
        )}

        <p className="text-xs text-gray-400">
          Tip: banyak faucet testnet butuh captcha → adapter menandai <em>manual</em>.
          Kita tetap antrikan job supaya worker mencatat hasil (OK/Pending/Manual).
        </p>
      </div>
    </FullLayout>
  );
}
