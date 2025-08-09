// pages/faucet-hunter.tsx
import { useEffect, useState } from 'react';
import FullLayout from '@/components/FullLayout';
import { fetchWallets } from '@/firebase';
import { adapters } from '@/utils/faucetAdapters';

type W = { address: string };

export default function FaucetHunterPage() {
  const [wallets, setWallets] = useState<W[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string>('');

  useEffect(() => {
    (async () => {
      const w = await fetchWallets();
      setWallets(w);
    })();
  }, []);

  const queue = async (address: string, chain: string) => {
    setLoading(true); setMsg('');
    try {
      const res = await fetch('/api/faucet/queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet: address, chain }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed');
      setMsg(`✅ Queued ${chain.toUpperCase()} for ${address}`);
    } catch (e: any) {
      setMsg(`❌ ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FullLayout title="Faucet Hunter">
      <h1 className="text-3xl font-bold text-cyan mb-6">🚰 Faucet Hunter</h1>
      <p className="text-gray-300 mb-6">
        Banyak faucet minta captcha. Sistem ini **mengantrikan** wallet kamu; kalau faucet-nya captcha-less bakal auto jalan.
        Kalau butuh manual, klik link faucet di kartu di bawah.
      </p>

      {msg && <div className="mb-4 text-white">{msg}</div>}

      <div className="grid gap-6">
        {wallets.map((w) => (
          <div key={w.address} className="bg-black/50 backdrop-blur-md border border-violet-600 rounded-xl p-4">
            <p className="font-mono text-sm mb-3 text-gray-200">{w.address}</p>
            <div className="flex flex-wrap gap-3">
              {adapters.map((a) => (
                <div key={`${w.address}-${a.chain}`} className="bg-carbon/60 rounded-lg p-3 border border-gray-700">
                  <p className="text-white text-sm mb-2">{a.name}</p>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={loading}
                      onClick={() => queue(w.address, a.chain)}
                      className="px-3 py-1 rounded bg-cyan text-black hover:bg-orchid transition disabled:opacity-50"
                    >
                      Queue
                    </button>
                    {!a.captchaLess && a.externalUrl && (
                      <a
                        href={a.externalUrl}
                        target="_blank"
                        className="px-3 py-1 rounded bg-black/40 border border-violet-500 text-white hover:bg-black/60"
                      >
                        Open Faucet
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </FullLayout>
  );
}