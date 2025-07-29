// components/ExportWalletsButton.tsx

import { fetchWallets } from '../firebase'; // FIX: ganti dari '@/firebase'

export default function ExportWalletsButton() {
  const handleExport = async () => {
    const wallets = await fetchWallets();
    const jsonData = JSON.stringify(wallets, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'wallets.json';
    link.click();
  };

  return (
    <button
      onClick={handleExport}
      className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 mt-4"
    >
      ⬇️ Export Semua Wallet
    </button>
  );
}