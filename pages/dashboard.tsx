import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>Nysola Dashboard</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-b from-black via-[#111] to-[#1a1a1a] text-white px-6 pt-24 md:px-20">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-cyan">🚀 Welcome Back, Commander</h1>
          <p className="text-gray-400 mt-2">AI Web3 Ops Center – Nysola</p>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row gap-10">
          {/* Left Panel: Stats */}
          <div className="flex-1 space-y-6">
            <div className="bg-carbon p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-bold text-orchid mb-2">🔐 Wallets</h2>
              <p className="text-gray-300">You have 7 wallets connected.</p>
              <Link href="/wallets" className="text-cyan underline text-sm">Manage Wallets</Link>
            </div>

            <div className="bg-carbon p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-bold text-orchid mb-2">📦 Tasks</h2>
              <p className="text-gray-300">AutoTask & Airdrop jobs are running smoothly.</p>
              <Link href="/auto" className="text-cyan underline text-sm">View Tasks</Link>
            </div>

            <div className="bg-carbon p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-bold text-orchid mb-2">📡 Transactions</h2>
              <p className="text-gray-300">Last TX: 0x...a123 confirmed 2 mins ago.</p>
              <Link href="/tx-history" className="text-cyan underline text-sm">Check History</Link>
            </div>
          </div>

          {/* Right Panel: Character */}
          <div className="flex-1 hidden md:flex justify-center items-start pt-4 animate-fade-in">
            <Image
              src="/main-character.png"
              alt="Nysola AI"
              width={400}
              height={600}
              className="rounded-xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </>
  );
}