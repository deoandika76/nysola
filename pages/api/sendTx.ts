// pages/api/sendTx.ts

import { ethers } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  const { to, privateKey, value } = req.body;

  try {
    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_SEPOLIA_RPC!);
    const wallet = new ethers.Wallet(privateKey, provider);

    // ✅ FIXED: Ambil balance dari provider, bukan dari wallet langsung
    const balance = await provider.getBalance(wallet.address);

    console.log("Current balance:", ethers.formatEther(balance));

    // Cek apakah cukup untuk TX
    const valueInWei = ethers.parseEther(value);
    if (balance < valueInWei) {
      return res.status(400).json({
        message: "Balance tidak cukup untuk mengirim transaksi",
        balance: ethers.formatEther(balance),
      });
    }

    const tx = await wallet.sendTransaction({
      to,
      value: valueInWei,
    });

    await tx.wait();

    res.status(200).json({ message: "Transaction sent!", txHash: tx.hash });
  } catch (error: any) {
    console.error("TX ERROR:", error);
    res.status(500).json({ message: "Transaction failed", error: error.message });
  }
}