// pages/hunters/mission.tsx
import { useState } from 'react';
import Head from 'next/head';

const missions = [
  'Join Airdrop Galxe campaign',
  'Claim faucet ETH testnet',
  'Bridge token to testnet chain',
  'Mint NFT on free chain',
  'Swap token on testnet DEX',
  'Complete quest on Zealy',
  'Retweet & tag a project for airdrop',
  'Join Discord + verify wallet',
  'Vote on snapshot proposal',
  'Claim testnet points',
  'Register early for new project',
  'Deploy contract testnet',
  'Run validator node (test)',
  'Submit feedback bug bounty',
  'Hold NFT pass for whitelist',
  'Stake token for early point',
  'Share referral link (invite)',
  'Cross-chain asset move',
  'Join Telegram bot campaign',
  'Follow project on Lens/zkSync',
  'Register whitelist Zealy',
  'Explore new L2 chain',
  'Try gasless transaction',
  'Do onchain quest Galxe',
  'Use DeFi testnet tools',
  'Verify Sybil detection',
  'Comment on Mirror.xyz',
  'Add liquidity testnet',
  'Register subdomain ENS testnet',
  'Complete mint & hold NFT testnet',
];

export default function HunterMissionPage() {
  const [completed, setCompleted] = useState<boolean[]>(Array(missions.length).fill(false));

  const toggle = (index: number) => {
    const updated = [...completed];
    updated[index] = !updated[index];
    setCompleted(updated);
  };

  return (
    <>
      <Head>
        <title>Hunter Missions – Nysola</title>
      </Head>

      <div className="min-h-screen bg-black text-white px-4 py-12">
        <h1 className="text-3xl font-bold mb-6 text-orchid">🚀 Hunter Missions</h1>
        <p className="mb-4 text-gray-400">Tandai progress misi hunter untuk pantauan kamu dan GOD EYE.</p>

        <div className="space-y-3">
          {missions.map((m, i) => (
            <label
              key={i}
              className={`flex items-center space-x-3 p-3 border rounded-md cursor-pointer transition ${
                completed[i] ? 'border-green-500 bg-green-900/20' : 'border-gray-700'
              }`}
            >
              <input
                type="checkbox"
                checked={completed[i]}
                onChange={() => toggle(i)}
                className="form-checkbox h-5 w-5 text-green-500"
              />
              <span className={completed[i] ? 'line-through text-gray-400' : ''}>{m}</span>
            </label>
          ))}
        </div>
      </div>
    </>
  );
}