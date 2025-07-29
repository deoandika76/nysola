import { useEffect, useState } from "react";
import { fetchWallets } from "../firebase"; // pake fungsi dari firebase.ts

export default function WalletsPage() {
  const [wallets, setWallets] = useState<any[]>([]);
  const [visibleIndex, setVisibleIndex] = useState<number | null>(null);

  useEffect(() => {
    const getWallets = async () => {
      const data = await fetchWallets();
      setWallets(data);
    };
    getWallets();
  }, []);

  const toggleVisibility = (index: number) => {
    setVisibleIndex(visibleIndex === index ? null : index);
  };

  const downloadWallet = (wallet: any) => {
    const fileData = JSON.stringify(wallet, null, 2);
    const blob = new Blob([fileData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${wallet.address}.json`;
    link.click();
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4 text-purple-400">🧾 Wallet List</h1>

      {wallets.length === 0 && <p className="text-gray-400">Belum ada wallet.</p>}

      <div className="grid gap-4">
        {wallets.map((wallet, index) => (
          <div
            key={wallet.id}
            className="bg-[#1a1a1a] border border-gray-700 p-4 rounded"
          >
            <p>🔗 <strong>Address:</strong> {wallet.address}</p>
            <p>
              🔑 <strong>Private Key:</strong>{" "}
              <span
                onClick={() => toggleVisibility(index)}
                className="cursor-pointer underline text-cyan"
              >
                {visibleIndex === index
                  ? wallet.privateKey
                  : "••••••••••••••••••••"}
              </span>
            </p>
            <p>
              🕓 <strong>Dibuat:</strong>{" "}
              {new Date(wallet.createdAt.seconds * 1000).toLocaleString()}
            </p>
            <button
              onClick={() => downloadWallet(wallet)}
              className="mt-3 px-4 py-2 bg-purple-600 rounded hover:bg-purple-700"
            >
              ⬇️ Export ke JSON
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}