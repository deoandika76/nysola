// utils/faucetAdapters.ts
export type FaucetTarget = 'sepolia' | 'scroll' | 'starknet' | 'zeta';

export type FaucetJob = {
  id?: string;
  wallet: string;
  chain: FaucetTarget;
  createdAt?: number;
};

export type FaucetResult =
  | { ok: true; txHash?: string; note?: string }
  | { ok: false; error: string; note?: string };

export interface FaucetAdapter {
  name: string;
  chain: FaucetTarget;
  // Banyak faucet minta captcha. Kalau false, kita cuma kasih link manual.
  captchaLess: boolean;
  requestTopup: (wallet: string) => Promise<FaucetResult>;
  externalUrl?: string; // link faucet bila butuh manual
}

// ====== Adapters ======
// NOTE: Kebanyakan faucet publik butuh captcha, jadi kita kasih pola:
// - kalau captchaLess === false → kita return note + externalUrl
// - nanti kalau kamu punya anti-captcha key, kita bikin adapter versi otomatis.

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export const adapters: FaucetAdapter[] = [
  {
    name: 'Sepolia (Alchemy Faucet)',
    chain: 'sepolia',
    captchaLess: false,
    externalUrl: 'https://www.alchemy.com/faucets/ethereum-sepolia',
    async requestTopup(wallet) {
      // Placeholder – perlu captcha.
      return { ok: false, error: 'captcha_required', note: 'Open the faucet link to claim.' };
    },
  },
  {
    name: 'Scroll Testnet Faucet',
    chain: 'scroll',
    captchaLess: false,
    externalUrl: 'https://scroll.io/faucet',
    async requestTopup() { return { ok: false, error: 'captcha_required', note: 'Manual claim required.' }; },
  },
  {
    name: 'Starknet Goerli Faucet',
    chain: 'starknet',
    captchaLess: false,
    externalUrl: 'https://faucet.goerli.starknet.io/',
    async requestTopup() { return { ok: false, error: 'captcha_required', note: 'Manual claim required.' }; },
  },
  {
    name: 'Zeta Chain Testnet Faucet',
    chain: 'zeta',
    captchaLess: false,
    externalUrl: 'https://labs.zetachain.com/get-zeta',
    async requestTopup() { return { ok: false, error: 'captcha_required', note: 'Manual claim required.' }; },
  },
];

// Helper pilih adapter by chain
export function getAdapterByChain(chain: FaucetTarget): FaucetAdapter | undefined {
  return adapters.find(a => a.chain === chain);
}