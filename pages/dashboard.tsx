// pages/dashboard.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import FullLayout from '@/components/FullLayout';
import TxChart from '@/components/TxChart';
import BalanceChart from '@/components/BalanceChart';
import DashboardCard from '@/components/DashboardCard';
import { listenToTxHistory } from '@/firebase';

type TxRow = {
  status: 'success' | 'failed';
  createdAt?: { seconds: number };
};

export default function Dashboard() {
  const [rows, setRows] = useState<TxRow[]>([]);

  useEffect(() => {
    const unsub = listenToTxHistory((arr: any[]) => {
      // map tipis (hindari bloat)
      setRows(
        arr.map((d) => ({
          status: d.status,
          createdAt: d.createdAt,
        }))
      );
    });
    return () => unsub();
  }, []);

  const { total, success, failed, rate, labels, successSeries, failedSeries } = useMemo(() => {
    const total = rows.length;
    const success = rows.filter(r => r.status === 'success').length;
    const failed = rows.filter(r => r.status === 'failed').length;
    const rate = total ? (success / total) * 100 : 0;

    // group sederhana by day (full data), label format DD/MM
    const map = new Map<string, { s: number; f: number }>();
    for (const r of rows) {
      const t = (r.createdAt?.seconds ?? 0) * 1000;
      const d = new Date(t);
      const key = isNaN(d.getTime()) ? 'Unknown' :
        `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
      const prev = map.get(key) || { s: 0, f: 0 };
      if (r.status === 'success') prev.s += 1; else prev.f += 1;
      map.set(key, prev);
    }
    const labels = Array.from(map.keys());
    const successSeries = Array.from(map.values()).map(v => v.s);
    const failedSeries = Array.from(map.values()).map(v => v.f);

    return { total, success, failed, rate, labels, successSeries, failedSeries };
  }, [rows]);

  return (
    <FullLayout title="Dashboard Analytics">
      <h1 className="text-4xl font-bold mb-3 text-cyan">📊 Dashboard Analytics</h1>
      <p className="text-gray-300 mb-8">
        Ringkasan performa transaksi & saldo wallet (data penuh).
      </p>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <DashboardCard title="Total Transactions" value={String(total)} icon="📦" />
        <DashboardCard title="Success" value={String(success)} icon="✅" color="text-green-400" />
        <DashboardCard title="Failed" value={String(failed)} icon="❌" color="text-red-400" />
        <DashboardCard title="Success Rate" value={`${rate.toFixed(1)}%`} icon="⚡" color="text-yellow-300" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TxChart labels={labels} successSeries={successSeries} failedSeries={failedSeries} />
        <BalanceChart />
      </div>
    </FullLayout>
  );
}