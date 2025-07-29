// components/ErrorBox.tsx

import React from 'react';

interface ErrorBoxProps {
  message: string;
}

export default function ErrorBox({ message }: ErrorBoxProps) {
  return (
    <div className="bg-red-950 border border-red-500 text-red-300 p-4 rounded-md mt-4">
      <p className="text-sm font-mono whitespace-pre-wrap break-all">
        ❌ Gagal mengirim TX:
        <br />
        {message}
      </p>
      <button
        onClick={() => navigator.clipboard.writeText(message)}
        className="mt-2 bg-red-800 hover:bg-red-700 text-white text-xs px-3 py-1 rounded"
      >
        📋 Salin Pesan Error
      </button>
    </div>
  );
}