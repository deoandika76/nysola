// utils/hunterAI.ts
import { Wallet } from '../types';
import { ethers } from 'ethers';

const dummyReceiver = '0x122CAa6b1cD0F4E3b30bfB85F22ec6c777Ee4c04';

// Fungsi untuk memfilter wallet aktif (yang punya saldo)
export async function filterActiveWallets(wallets: Wallet[], provider: ethers.JsonRpcProvider) {
  const active: Wallet[] = [];

  for (const wallet of wallets) {
    try {
      const balance = await provider.getBalance(wallet.address);
      if (balance > ethers.parseEther('0.00005')) {
        active.push(wallet);
      }
    } catch (err) {
      console.error(`❌ Failed check balance ${wallet.address}`, err);
    }
  }

  return active;
}

// Fungsi untuk pilih target wallet yang ingin dipakai task selanjutnya
export function pickTarget(wallets: Wallet[]) {
  // Kamu bisa ubah logika pemilihan (acak, prioritas, dll)
  return wallets.length > 0 ? wallets[0] : null;
}