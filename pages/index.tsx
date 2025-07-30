import Link from 'next/link';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Nysola – AI Hunter</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white px-6 pt-24 md:px-20">
        {/* Hero */}
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12">
          <div className="flex-1">
            <h1 className="text-4xl md:text-6xl font-bold text-orchid mb-4 animate-fade-in">
              Welcome to <span className="block text-cyan">NYSOLA</span>
            </h1>
            <p className="text-lg text-gray-300 mb-6">
              Autonomous AI Web3 Cuan Hunter — powered by your own AI agents.
            </p>
            <Link href="/dashboard">
              <button className="bg-orchid hover:bg-cyan text-white px-6 py-3 rounded-xl font-semibold transition">
                🚀 Get Started
              </button>
            </Link>
          </div>
          <div className="flex-1 animate-slide-in">
            <img
              src="/nysola-character-1.png"
              alt="Nysola AI"
              className="w-full max-w-md mx-auto rounded-2xl shadow-xl"
            />
          </div>
        </div>

        {/* Features */}
        <div className="mt-28">
          <h2 className="text-center text-3xl font-bold mb-12">✨ Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            {[
              {
                title: 'Auto Task Engine',
                desc: 'Auto execute cuan tasks on chain & off chain.',
                icon: '🛠️',
              },
              {
                title: 'Secure Wallet Vault',
                desc: 'Encrypted key storage & private toggle.',
                icon: '🛡️',
              },
              {
                title: 'Airdrop Intelligence',
                desc: 'Analyze testnets & hunt high-potential drops.',
                icon: '🛰️',
              },
            ].map((f, i) => (
              <div
                key={i}
                className="bg-carbon p-6 rounded-2xl shadow-md hover:shadow-purple-500 transition-all transform hover:scale-105"
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-semibold text-orchid mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* About + CTA */}
        <div className="mt-32 text-center animate-fade-up">
          <h3 className="text-2xl md:text-4xl font-bold mb-4">
            Let the AI hunt while you chill.
          </h3>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">
            Nysola is your autonomous companion in Web3 — powered by machine logic, fine-tuned for airdrops, tasks, and crypto automation.
          </p>
          <Link href="/hunter">
            <button className="bg-cyan hover:bg-orchid text-white px-8 py-3 rounded-xl font-bold transition-all">
              🧠 Start Hunting
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}