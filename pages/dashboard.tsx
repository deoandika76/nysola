// pages/dashboard.tsx
import { useEffect, useMemo, useState } from 'react';
import DashboardCard from '@/components/DashboardCard';
import TxChart from '@/components/TxChart';
import BalanceChart from '@/components/BalanceChart';
import FullLayout from '@/components/FullLayout';
import { listenToTxHistory } from '@/firebase';

type Tx = {
  status: 'success' | 'failed';
  timestamp?: { seconds: number };
};

const WINDOW_MIN = 60; // bandingkan 60 menit terakhir vs 60 menit sebelumnya

export default function Dashboard() {
  const [txs, setTxs] = useState<Tx[]>([]);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const un = listenToTxHistory((raw) => {
      // @ts-ignore: bentuk dari firebase.ts
      setTxs(raw as Tx[]);
    });
    return () => un();
  }, []);

  const now = Date.now();
  const curStart = now - WINDOW_MIN * 60 * 1000;
  const prevStart = now - 2 * WINDOW_MIN * 60 * 1000;

  const {
    totalNow,
    succNow,
    failNow,
    totalPrev,
    succPrev,
    failPrev,
    successRate,
    trendTotal,
    trendSucc,
    trendFail,
  } = useMemo(() => {
    const inRange = (t?: number, start?: number, end?: number) =>
      t && start && end ? t >= start && t < end : false;

    const cur = txs.filter((t) =>
      inRange((t.timestamp?.seconds || 0) * 1000, curStart, now)
    );
    const prev = txs.filter((t) =>
      inRange((t.timestamp?.seconds || 0) * 1000, prevStart, curStart)
    );

    const count = (arr: Tx[], s?: 'success' | 'failed') =>
      typeof s === 'undefined' ? arr.length : arr.filter((x) => x.status === s).length;

    const totalNow = count(cur);
    const succNow = count(cur, 'success');
    const failNow = count(cur, 'failed');

    const totalPrev = count(prev);
    const succPrev = count(prev, 'success');
    const failPrev = count(prev, 'failed');

    const pct = (nowVal: number, prevVal: number) => {
      if (prevVal === 0 && nowVal === 0) return 0;
      if (prevVal === 0) return 100; // lonjakan dari 0
      return ((nowVal - prevVal) / prevVal) * 100;
    };

    const successRate = totalNow ? (succNow / totalNow) * 100 : 0;

    return {
      totalNow,
      succNow,
      failNow,
      totalPrev,
      succPrev,
      failPrev,
      successRate,
      trendTotal: pct(totalNow, totalPrev),
      trendSucc: pct(succNow, succPrev),
      trendFail: pct(failNow, failPrev),
    };
  }, [txs, curStart, now]);

  return (
    <FullLayout title="Dashboard - Nysola">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold text-cyan">📊 Dashboard Analytics</h1>

        <button
          onClick={() => setCompact((s) => !s)}
          className="rounded-lg border border-violet-600/50 bg-white/5 px-3 py-1.5 text-sm text-white hover:bg-white/10 transition"
        >
          {compact ? 'Expanded' : 'Compact'} view
        </button>
      </div>

      <p className="text-gray-300/80 mb-8">
        Ringkasan performa transaksi & saldo wallet. Perbandingan {WINDOW_MIN} menit terakhir
        vs {WINDOW_MIN} menit sebelumnya.
      </p>

      <div className="flex flex-wrap gap-6 justify-center mb-10">
        <DashboardCard
          title="Total Transactions"
          value={String(totalNow)}
          icon="📦"
          subtitle={`${totalPrev} sebelumnya`}
          trendPct={trendTotal}
          trendLabel=""
          compact={compact}
        />
        <DashboardCard
          title="Success"
          value={String(succNow)}
          icon="✅"
          color="text-green-400"
          subtitle={`${succPrev} sebelumnya`}
          trendPct={trendSucc}
          compact={compact}
        />
        <DashboardCard
          title="Failed"
          value={String(failNow)}
          icon="❌"
          color="text-red-500"
          subtitle={`${failPrev} sebelumnya`}
          trendPct={trendFail}
          compact={compact}
        />
        {!compact && (
          <DashboardCard
            title="Success Rate"
            value={`${successRate.toFixed(1)}%`}
            icon="⚡"
            color="text-cyan"
            subtitle="(window saat ini)"
          />
        )}
      </div>

      <div className="grid grid-cols-1 gap-8">
        <TxChart success={succNow} failed={failNow} compact={compact} />
        <BalanceChart refreshMs={60000} compact={compact} />
      </div>
    </FullLayout>
  );
}