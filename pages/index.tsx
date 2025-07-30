import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-carbon to-zinc-900 text-white">
      <div className="flex flex-col md:flex-row items-center justify-between px-8 py-20">
        <div className="max-w-xl space-y-6">
          <h1 className="text-5xl font-bold text-orchid">Welcome to Nysola</h1>
          <p className="text-lg text-gray-300">
            Autonomous AI Web3 Wallet Hunter — buatan gue sendiri 😎
          </p>
          <a
            href="/dashboard"
            className="inline-block bg-orchid hover:bg-pink-600 transition px-6 py-3 rounded-lg text-white font-medium mt-4"
          >
            Get Started 🚀
          </a>
        </div>

        <div className="mt-12 md:mt-0">
          <Image
            src="/main-character.png"
            alt="Main Character"
            width={500}
            height={700}
            priority
            className="rounded-2xl shadow-xl"
          />
        </div>
      </div>
    </div>
  );
}