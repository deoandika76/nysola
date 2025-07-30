// pages/index.tsx
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>Welcome to Nysola – AI Hunter</title>
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-carbon text-white px-6 md:px-20 py-20 font-sans">
        {/* Hero Section */}
        <section className="flex flex-col-reverse md:flex-row items-center justify-between gap-12 animate-fade-in">
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-6xl font-extrabold text-orchid leading-tight">
              Welcome to <span className="text-cyan block">NYSOLA</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-md">
              Autonomous AI Web3 Cuan Hunter — powered by your own AI agents. 
              Track, hunt, and dominate airdrops & testnets with precision.
            </p>
            <Link href="/dashboard">
              <button className="bg-orchid hover:bg-cyan text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg animate-pulse">
                🚀 Get Started
              </button>
            </Link>
          </div>

          <div className="md:w-1/2 relative animate-slide-in">
            <img
              src="/main-character.png"
              alt="Nysola Agent"
              className="w-full max-w-sm mx-auto drop-shadow-[0_0_30px_#a855f7]"
            />
            {/* Floating panels */}
            <div className="absolute top-8 right-4 bg-carbon border border-purple-700 rounded-xl px-4 py-2 shadow-md animate-float-up">
              <p className="text-sm text-cyan">Secure Wallets</p>
            </div>
            <div className="absolute bottom-8 left-2 bg-carbon border border-cyan-600 rounded-xl px-4 py-2 shadow-md animate-float-down">
              <p className="text-sm text-purple-300">Testnet TX Power</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mt-28 animate-fade-up">
          <h2 className="text-center text-3xl font-bold mb-12">⚡ Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              {
                title: 'Auto Task Engine',
                desc: 'Execute tasks both on-chain and off-chain like a true bot hunter.',
                icon: '⚙️',
              },
              {
                title: 'Secure Wallet Vault',
                desc: 'Private key encryption with toggle visibility & JSON export.',
                icon: '🔐',
              },
              {
                title: 'Airdrop Intelligence',
                desc: 'Analyze testnets, track hot drops, and queue task strategy.',
                icon: '🧠',
              },
            ].map((f, i) => (
              <div
                key={i}
                className="bg-carbon border border-gray-700 p-6 rounded-2xl hover:scale-105 hover:shadow-lg transition-all"
              >
                <div className="text-5xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-semibold text-orchid mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call To Action */}
        <section className="mt-32 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Let the AI hunt while you chill 😎
          </h3>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">
            Nysola is your autonomous weapon — grind smarter not harder.
          </p>
          <Link href="/hunter">
            <button className="bg-cyan hover:bg-orchid text-white px-8 py-3 rounded-xl font-bold transition-all animate-bounce">
              🔫 Start Hunting
            </button>
          </Link>
        </section>
      </main>
    </>
  );
}