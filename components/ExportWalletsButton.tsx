// components/ExportWalletsButton.tsx

import { fetchWallets } from '@/firebase';

export default function ExportWalletsButton() {
  const handleExport = async () => {
    try {
      const wallets = await fetchWallets();
      const json = JSON.stringify(wallets, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'wallets.json';
      link.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Gagal mengekspor wallet');
    }
  };

  return (
    <button
      onClick={handleExport}
      className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition"
    >
      📦 Export Wallets
    </button>
  );
}