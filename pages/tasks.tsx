import Layout from '../components/Layout';
import { useState } from 'react';

export default function Tasks() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendTx = async () => {
    setLoading(true);
    setResult('');

    try {
      const response = await fetch('/api/sendTx', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: '0x122CAa6b1cD0F4E3b30bfB85F22ec6c777Ee4c04', // GANTI dengan alamat wallet tujuan testnet (Sepolia)
          value: '0.001', // ETH sebagai string
          privateKey: '0xc07edecf92f3a28d931449a4ca8bf076cf45dd23feb71c11cbae022712c8ad99' // GANTI dengan private key asli dari wallet testnet
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(`✅ TX berhasil dikirim: ${data.txHash}`);
      } else {
        setResult(`❌ Gagal mengirim TX: ${data.message}`);
      }
    } catch (error: any) {
      setResult(`❌ Gagal mengirim TX: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-purple-500 mb-4">Tasks</h1>
      <p className="text-gray-400 mb-6">Test pengiriman transaksi testnet Sepolia</p>

      <button
        onClick={handleSendTx}
        disabled={loading}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition disabled:opacity-50"
      >
        {loading ? 'Mengirim...' : 'Kirim Testnet TX 🚀'}
      </button>

      {result && (
        <div className="mt-4 bg-black text-green-400 p-4 rounded font-mono">
          {result}
        </div>
      )}
    </Layout>
  );
}