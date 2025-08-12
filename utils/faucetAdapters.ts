// utils/faucetAdapters.ts

// ===== Types =====
export type FaucetChain =
  | 'sepolia'
  | 'base-sepolia'
  | 'arbitrum-sepolia'
  | 'optimism-sepolia'
  | 'scroll-sepolia'
  | 'zeta-testnet';

export type FaucetTopupResult =
  | { ok: true; txHash?: string; note?: string }
  | { ok: false; error: string; note?: string };

export interface FaucetJob {
  chain: FaucetChain;
  wallet: string;
}

export interface FaucetAdapter {
  name: string;           // label adapter
  chain: FaucetChain;     // chain yang didukung
  requestTopup: (wallet: string) => Promise<FaucetTopupResult>;
}

// ===== Helper util (mock delay biar UX kerasa "requesting") =====
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ===== Adapters (aman untuk serverless & tidak boros kuota) =====
// NOTE: Banyak faucet public pakai captcha/rate-limit → kita tandai manual.
// Saat ketemu faucet API yang stabil, tinggal ganti logic requestTopup.

const sepoliaManual: FaucetAdapter = {
  name: 'Alchemy Sepolia Faucet (manual)',
  chain: 'sepolia',
  async requestTopup(wallet) {
    await wait(300);
    return {
      ok: false,
      error: 'manual_required',
      note:
        `Open faucet & claim manually: https://www.alchemy.com/faucets/ethereum-sepolia\n` +
        `Wallet: ${wallet}`,
    };
  },
};

const baseSepoliaManual: FaucetAdapter = {
  name: 'Base Sepolia Faucet (manual)',
  chain: 'base-sepolia',
  async requestTopup(wallet) {
    await wait(300);
    return {
      ok: false,
      error: 'manual_required',
      note:
        `Open faucet & claim manually: https://www.alchemy.com/faucets/base-sepolia\n` +
        `Wallet: ${wallet}`,
    };
  },
};

const arbSepoliaManual: FaucetAdapter = {
  name: 'Arbitrum Sepolia Faucet (manual)',
  chain: 'arbitrum-sepolia',
  async requestTopup(wallet) {
    await wait(300);
    return {
      ok: false,
      error: 'manual_required',
      note:
        `Open faucet & claim manually: https://www.alchemy.com/faucets/arbitrum-sepolia\n` +
        `Wallet: ${wallet}`,
    };
  },
};

const opSepoliaManual: FaucetAdapter = {
  name: 'Optimism Sepolia Faucet (manual)',
  chain: 'optimism-sepolia',
  async requestTopup(wallet) {
    await wait(300);
    return {
      ok: false,
      error: 'manual_required',
      note:
        `Open faucet & claim manually: https://www.alchemy.com/faucets/optimism-sepolia\n` +
        `Wallet: ${wallet}`,
    };
  },
};

const scrollSepoliaManual: FaucetAdapter = {
  name: 'Scroll Sepolia Faucet (manual)',
  chain: 'scroll-sepolia',
  async requestTopup(wallet) {
    await wait(300);
    return {
      ok: false,
      error: 'manual_required',
      note:
        `Open faucet & claim manually: https://sepolia.scroll.io/faucet\n` +
        `Wallet: ${wallet}`,
    };
  },
};

const zetaManual: FaucetAdapter = {
  name: 'Zeta Testnet Faucet (manual)',
  chain: 'zeta-testnet',
  async requestTopup(wallet) {
    await wait(300);
    return {
      ok: false,
      error: 'manual_required',
      note:
        `Open faucet & claim manually: https://labs.zetachain.com/get-zeta\n` +
        `Wallet: ${wallet}`,
    };
  },
};

// ===== Registry =====
const ADAPTERS: Readonly<FaucetAdapter[]> = [
  sepoliaManual,
  baseSepoliaManual,
  arbSepoliaManual,
  opSepoliaManual,
  scrollSepoliaManual,
  zetaManual,
];

// Cari adapter by chain
export function getAdapterByChain(chain: FaucetChain): FaucetAdapter | undefined {
  return ADAPTERS.find((a) => a.chain === chain);
}

// ===== Exports untuk UI =====
export const adapters: Readonly<FaucetAdapter[]> = ADAPTERS;
export const supportedChains: Readonly<FaucetChain[]> = ADAPTERS.map((a) => a.chain);