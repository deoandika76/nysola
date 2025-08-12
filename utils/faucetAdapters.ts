// utils/faucetAdapters.ts
// Registry adaptor faucet + tipe data yang dipakai faucetRunner.

export type FaucetChain =
  | 'sepolia'
  | 'base-sepolia'
  | 'holesky'
  | string; // bebas, bisa tambah sendiri

export type FaucetJob = {
  wallet: string;   // alamat EVM tujuan topup
  chain: FaucetChain;
};

// Hasil dari adaptor faucet
export type FaucetResult = {
  ok: boolean;        // true = berhasil submit / topup; false = pending/manual/failed
  txHash?: string;    // kalau ada TX hash dari faucet
  note?: string;      // catatan kecil (opsional)
  error?: string;     // pesan error singkat (opsional)
};

export interface FaucetAdapter {
  name: string;
  chain: FaucetChain;
  requestTopup(wallet: string): Promise<FaucetResult>;
}

/**
 * Adaptor DUMMY: selalu balikin "pending/manual".
 * Gunakan kalau faucet aslinya pakai CAPTCHA atau rate limit.
 */
const dummyManualAdapter = (chain: FaucetChain): FaucetAdapter => ({
  name: `dummy-${chain}`,
  chain,
  async requestTopup(wallet: string): Promise<FaucetResult> {
    // Di sini kita gak call apa pun biar aman kuota.
    return {
      ok: false,
      note: `Submit manual di faucet ${chain}. Wallet: ${wallet}`,
      error: 'manual_captcha_or_rate_limit',
    };
  },
});

/**
 * Contoh adaptor HTTP generik (jika kamu punya endpoint faucet internal sendiri)
 * Set ENV: FAUCET_GENERIC_URL (mis. service internal kamu)
 * Body: { chain, wallet } → { ok, txHash?, error? }
 */
const genericHttpAdapter: FaucetAdapter = {
  name: 'generic-http',
  chain: 'sepolia', // default, tapi bisa tetap dipakai multi-chain via body
  async requestTopup(wallet: string): Promise<FaucetResult> {
    const url = process.env.FAUCET_GENERIC_URL;
    if (!url) {
      return {
        ok: false,
        error: 'missing_FAUCET_GENERIC_URL',
        note: 'Set FAUCET_GENERIC_URL agar adaptor HTTP bisa bekerja',
      };
    }

    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 15000); // 15s timeout

      const res = await fetch(url, {
        method: 'POST',
        signal: ctrl.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet }),
      }).catch((e) => {
        throw new Error(e?.message || 'fetch_failed');
      });

      clearTimeout(t);

      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        return { ok: false, error: `http_${res.status}`, note: txt?.slice(0, 120) };
      }

      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        txHash?: string;
        error?: string;
        note?: string;
      };

      return {
        ok: !!data.ok,
        txHash: data.txHash,
        error: data.error,
        note: data.note,
      };
    } catch (e: any) {
      return { ok: false, error: e?.message || 'generic_http_error' };
    }
  },
};

/**
 * Registry adapter yang aktif.
 * - Untuk chain umum: duluin dummyManualAdapter (aman kuota).
 * - Kalau kamu nanti punya faucet internal, tinggal ganti ke genericHttpAdapter
 *   atau bikin adapter baru dan daftarin di array ini.
 */
const ADAPTERS: FaucetAdapter[] = [
  // ====== Aman dulu (manual) ======
  dummyManualAdapter('sepolia'),
  dummyManualAdapter('base-sepolia'),
  dummyManualAdapter('holesky'),

  // ====== Contoh adaptor HTTP (opsional) ======
  // genericHttpAdapter,
];

export const adapters: Readonly<FaucetAdapter[]> = ADAPTERS;
export const supportedChains: Readonly<FaucetChain[]> = ADAPTERS.map(a => a.chain);
export function getAdapterByChain(chain: FaucetChain): FaucetAdapter | undefined {
  // cari adapter yang chain-nya sama persis
  const exact = ADAPTERS.find((a) => a.chain === chain);
  if (exact) return exact;

  // fallback: kalau gak ketemu, coba pakai genericHttpAdapter kalau mau
  // return genericHttpAdapter;

  // default: undefined → biar faucetRunner tulis "adapter_not_found"
  return undefined;
}