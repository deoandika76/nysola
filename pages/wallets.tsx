
import Layout from '../components/Layout';

const dummyWallets = [
  {
    address: '0x1234...abcd',
    eligible: true,
    balance: '1.24 ETH',
    reputation: 92,
  },
  {
    address: '0xaBcd...7788',
    eligible: false,
    balance: '0.02 ETH',
    reputation: 54,
  },
  {
    address: '0xdeaf...beef',
    eligible: true,
    balance: '0.73 ETH',
    reputation: 80,
  },
];

export default function Wallets() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold text-orchid mb-4">Wallet Tracker</h1>
      <div className="grid gap-4">
        {dummyWallets.map((wallet, i) => (
          <div
            key={i}
            className={`border rounded p-4 ${
              wallet.eligible ? 'border-cyan' : 'border-red-600'
            }`}
          >
            <p className="text-white font-mono text-sm">🔗 {wallet.address}</p>
            <p className="text-gray-400">Balance: {wallet.balance}</p>
            <p className="text-gray-400">
              Reputasi: <span className="text-cyan">{wallet.reputation}</span>/100
            </p>
            <p className={`mt-1 font-semibold ${wallet.eligible ? 'text-green-400' : 'text-red-400'}`}>
              {wallet.eligible ? '✅ Eligible' : '❌ Not Eligible'}
            </p>
          </div>
        ))}
      </div>
    </Layout>
  );
}