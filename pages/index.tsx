import Link from 'next/link';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Nysola – Autonomous AI Hunter</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-b from-black via-[#0a0a1a] to-gray-900 text-white px-6 pt-20 md:px-20 font-futuristic">

        {/* Hero */}
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12">
          {/* Text Section */}
          <div className="flex-1">
            <h1 className="text-4xl md:text-6xl font-bold text-orchid mb-4 drop-shadow-md animate-fade-in">
              Welcome to <span className="block text-cyan">NYSOLA</span>
            </h1>
            <p className="text-lg text-gray-300 mb-6 max-w-md">
              Autonomous AI Web3 Cuan Hunter — powered by your own AI agents. Track, hunt, and dominate airdrops & testnets with precision.
            </p>
            <Link href="/dashboard">
              <button className="bg-orchid hover:bg-cyan text-white px-6 py-3 rounded-xl font-semibold transition shadow-xl animate-bounce">
                🚀 Get Started
              </button>
            </Link>
          </div>

          {/* Character Image */}
          <div className="flex-1">
            <img
              src="/main-character.png"
              alt="Nysola AI"
              className="w-full max-w-md mx-auto rounded-xl shadow-purple-900 shadow-2xl animate-glow"
            />
          </div>
        </div>

        {/* Key Features */}
        <div className="mt-28">
          <h2 className="text-center text-3xl font-bold mb-12 text-white">⚡ Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            {[
              {
                title: 'Auto Task Engine',
                desc: 'Execute tasks both on-chain and off-chain like a true bot hunter.',
                icon: '🛠️',
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
                className="bg-carbon p-6 rounded-2xl shadow-md hover:shadow-purple-500/30 hover:-translate-y-1 transition-all"
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-semibold text-orchid mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-32 text-center animate-fade-up">
          <h3 className="text-2xl md:text-4xl font-bold mb-4">
            Let the AI hunt while you chill 😎
          </h3>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">
            Nysola is your autonomous Web3 weapon — grind smarter not harder.
          </p>
          <Link href="/hunter">
            <button className="bg-cyan hover:bg-orchid text-black px-8 py-3 rounded-xl font-bold transition shadow-xl">
              🧠 Start Hunting
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}