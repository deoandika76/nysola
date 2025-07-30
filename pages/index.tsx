import Link from 'next/link';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Welcome to Nysola</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white px-6 pt-24 md:px-20 flex flex-col items-center justify-center font-futuristic text-center">
        <img
          src="/main-character.png"
          alt="Nysola AI"
          className="w-80 mb-8 rounded-2xl shadow-lg animate-fade-in"
        />
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-orchid">
          Welcome to <span className="text-cyan">NYSOLA</span>
        </h1>
        <p className="text-lg text-gray-400 mb-8 max-w-md">
          Your autonomous AI Web3 Hunter. Secure wallet, airdrop bot, and auto tasks — all in one.
        </p>
        <Link href="/login">
          <button className="bg-cyan hover:bg-orchid text-black px-6 py-3 rounded-xl font-bold transition shadow-xl animate-bounce">
            🚀 Get Started
          </button>
        </Link>
      </div>
    </>
  );
}