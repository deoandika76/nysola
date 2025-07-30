// utils/walletConnect.ts
import { ethers } from 'ethers';

export async function connectWithMetamask(): Promise<string | null> {
  if (typeof window === 'undefined' || !(window as any).ethereum) {
    alert('Metamask tidak tersedia di browser ini.');
    return null;
  }

  try {
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const accounts = await provider.send('eth_requestAccounts', []);
    return accounts[0]; // address pertama
  } catch (err: any) {
    console.error('Gagal connect:', err.message);
    return null;
  }
}