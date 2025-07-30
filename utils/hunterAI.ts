// utils/hunterAI.ts
import { Wallet } from '../types';
import { ethers } from 'ethers';

/**
 * Filter wallet yang punya saldo cukup di testnet
 */
export async function filterActiveWallets(wallets: Wallet[], rpcUrl: string): Promise<Wallet[]> {
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const minBalance = ethers.parseEther('0.0001');

  const activeWallets: Wallet[] = [];

  for (const wallet of wallets) {
    try {
      const balance = await provider.getBalance(wallet.address);
      if (balance >= minBalance) {
        activeWallets.push(wallet);
      }
    } catch (err) {
      console.error(`Gagal cek saldo wallet ${wallet.address}`, err);
    }
  }

  return activeWallets;
}

/**
 * Pilih beberapa wallet secara acak dari yang aktif
 */
export function selectRandomTargets(wallets: Wallet[], count = 3): Wallet[] {
  const shuffled = [...wallets].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}