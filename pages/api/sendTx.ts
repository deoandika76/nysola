import { ethers } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  const { to, privateKey, value } = req.body;

  try {
    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_SEPOLIA_RPC!);
    const wallet = new ethers.Wallet(privateKey, provider);

    const balance = await wallet.getBalance();
    console.log("Current balance:", ethers.formatEther(balance));

    const tx = await wallet.sendTransaction({
      to,
      value: ethers.parseEther(value),
    });

    await tx.wait();

    res.status(200).json({ message: "Transaction sent!", txHash: tx.hash });
  } catch (error: any) {
    console.error("TX ERROR:", error);
    res.status(500).json({ message: error.message, stack: error.stack || 'No stack' });
  }
}