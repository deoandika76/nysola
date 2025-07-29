// pages/api/sendTx.ts
import { ethers } from "ethers";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Only POST allowed' });

  const { to, privateKey, value } = req.body;

  try {
    const provider = new ethers.providers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/BM2Wx8plEidiluB5zuAHU"); // ganti dengan milikmu

    const wallet = new ethers.Wallet(privateKey, provider);

    const tx = await wallet.sendTransaction({
      to,
      value: ethers.utils.parseEther(value), // kirim ETH (dalam string, contoh: "0.01")
    });

    const receipt = await tx.wait();

    res.status(200).json({ message: "Transaksi berhasil dikirim!", receipt });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengirim transaksi", error: error.message });
  }
}