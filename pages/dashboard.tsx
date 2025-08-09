// pages/dashboard.tsx
import { useEffect, useMemo, useState } from 'react';
import FullLayout from '@/components/FullLayout';
import { listenToTxHistory } from '@/firebase';
import TxChart from '@/components/TxChart';
import BalanceChart from '@/components/BalanceChart';
import GlassSection from '@/components/ui/GlassSection';
import KPIStat from '@/components/KPIStat';

export default function Dashboard() {
  const [txCount, setTxCount] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);

  useEffect(() => {
    const unsub = listenToTxHistory((rows) => {
      setTxCount(rows.length);
      setSuccessCount(rows.filter((d) => d.status === 'success').length);
      setFailedCount(rows.filter((d) => d.status === 'failed').length);
    });
    return () => unsub();
  }, []);

  const successRate = useMemo(
    () => (txCount ? (successCount / txCount) * 100 : 0),
    [txCount, successCount]
  );

  // contoh seri sparkline (dummy dari akumulasi harian)
  const kpiSeries = useMemo(() => ({
    total: [200, 360, 520, 730, 900, 1100, txCount],
    success: [195, 350, 505, 710, 880, 1080, successCount],
    failed: [5, 10, 15, 20, 20, 20, failedCount],
  }), [txCount, successCount, failedCount]);

  return (
    <FullLayout title="Dashboard - Nysola">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-cyan-300 drop-shadow">
          📊 Dashboard Analytics
        </h1>
        <p className="mt-2 text-gray-300">
          Ringkasan performa transaksi & saldo wallet.
        </p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <KPIStat
          label="Total Transactions"
          value={txCount.toLocaleString('id-ID')}
          delta={+((kpiSeries.total.at(-1)! - kpiSeries.total.at(0)!) / Math.max(kpiSeries.total.at(0)!,1) * 100).toFixed(1)}
          series={kpiSeries.total}
          icon={<span className="text-2xl">📦</span>}
        />
        <KPIStat
          label="Success"
          value={successCount.toLocaleString('id-ID')}
          delta={+((kpiSeries.success.at(-1)! - kpiSeries.success.at(0)!) / Math.max(kpiSeries.success.at(0)!,1) * 100).toFixed(1)}
          series={kpiSeries.success}
          icon={<span className="text-2xl">✅</span>}
        />
        <KPIStat
          label="Failed"
          value={failedCount}
          delta={-3.2}
          series={kpiSeries.failed}
          icon={<span className="text-2xl">❌</span>}
        />
        <KPIStat
          label="Success Rate"
          value={`${successRate.toFixed(1)}%`}
          series={[60, 68, 70, 74, 78, 80, successRate]}
          icon={<span className="text-2xl">⚡</span>}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassSection title="📈 Transaction Chart" subtitle="Distribusi success vs failed">
          <TxChart success={successCount} failed={failedCount} />
        </GlassSection>

        <GlassSection
          title="💳 Wallet Balance"
          subtitle="Total & distribusi antar wallet"
          right={<span className="text-amber-300 font-semibold text-sm">Realtime (read‑only)</span>}
        >
          <BalanceChart />
        </GlassSection>
      </div>

      {/* Quick actions */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <a href="/wallets" className="rounded-xl border border-cyan-500/40 bg-cyan-400/10 hover:bg-cyan-400/20 transition px-5 py-4 text-cyan-200 font-semibold text-center">
          🔐 Wallets
        </a>
        <a href="/auto" className="rounded-xl border border-purple-500/40 bg-purple-400/10 hover:bg-purple-400/20 transition px-5 py-4 text-purple-200 font-semibold text-center">
          🤖 Auto Task
        </a>
        <a href="/nysola-ops" className="rounded-xl border border-amber-500/40 bg-amber-400/10 hover:bg-amber-400/20 transition px-5 py-4 text-amber-200 font-semibold text-center">
          🧭 Nysola Ops
        </a>
      </div>
    </FullLayout>
  );
}