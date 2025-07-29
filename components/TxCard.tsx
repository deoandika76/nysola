// components/TxCard.tsx
import React from 'react';

interface TxCardProps {
  from: string;
  to: string;
  value: string;
  txHash: string;
  createdAt: string;
}

export default function TxCard({ from, to, value, txHash, createdAt }: TxCardProps) {
  return (
    <div className="bg-[#1a1a1a] border border-gray-800 p-4 rounded-lg shadow-sm transition hover:shadow-md">
      <p className="text-sm text-cyan-400 mb-1">
        ⛏️ <span className="font-semibold">From:</span> {from}
      </p>
      <p className="text-sm text-purple-400 mb-1">
        🎯 <span className="font-semibold">To:</span> {to}
      </p>
      <p className="text-sm text-green-400 mb-1">
        💸 <span className="font-semibold">Value:</span> {value} ETH
      </p>
      <p className="text-sm text-yellow-400 mb-1 break-all">
        🔗 <span className="font-semibold">TX Hash:</span>{' '}
        <a
          href={`https://sepolia.etherscan.io/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-yellow-500"
        >
          {txHash}
        </a>
      </p>
      <p className="text-sm text-gray-400">
        🕒 <span className="font-semibold">Time:</span> {createdAt}
      </p>
    </div>
  );
}