import { useState } from 'react';
import Layout from '../components/Layout';

export default function Tasks() {
  const [status, setStatus] = useState<string | null>(null);

  const sendTestTx = async () => {
    setStatus("Mengirim transaksi testnet...");
    try {
      const res = await fetch("/api/SendTx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "0x122CAa6b1cD0F4E3b30bfB85F22ec6c777Ee4c04", // 👉 Ganti dengan wallet tujuan kamu (testnet Sepolia)
          privateKey: "0xc07edecf92f3a28d931449a4ca8bf076cf45dd23feb71c11cbae022712c8ad99", // 👉 Ganti dengan privateKey yang dari Firebase (sementara)
          value: "0.001" // 👉 Jumlah ETH testnet
        }),
      });

      const result = await res.json();
      setStatus(JSON.stringify(result, null, 2));
    } catch (err) {
      setStatus("❌ Gagal mengirim TX: " + String(err));
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-purple-500">Tasks</h1>
      <p className="mt-2 text-gray-400">Test pengiriman transaksi testnet Sepolia</p>

      <button
        onClick={sendTestTx}
        className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        Kirim Testnet TX 🚀
      </button>

      {status && (
        <pre className="mt-4 text-sm bg-gray-800 text-green-300 p-4 rounded max-w-full overflow-auto">
          {status}
        </pre>
      )}
    </Layout>
  );
}