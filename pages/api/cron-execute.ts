// pages/api/cron-execute.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { executeAutoTask } from '../../utils/executor';
import { processOneFaucetJob } from '../../utils/faucetRunner';

type RunMode = 'auto' | 'faucet' | 'both';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end('Only GET allowed');

  // pilih mode via query ?run=auto|faucet|both (default both)
  const mode = (req.query.run as RunMode) || 'both';

  try {
    const tasks: Promise<any>[] = [];

    if (mode === 'auto' || mode === 'both') {
      tasks.push(
        executeAutoTask().then((r) => ({ tag: 'autoTask', ok: true, result: r }))
      );
    }
    if (mode === 'faucet' || mode === 'both') {
      tasks.push(
        processOneFaucetJob().then((r) => ({ tag: 'faucet', ok: true, result: r }))
      );
    }

    // Kalau tidak ada apa pun yang dijalankan (aneh), langsung balikin
    if (tasks.length === 0) {
      return res.status(200).json({ ok: true, message: 'Nothing to run' });
    }

    const settled = await Promise.allSettled(tasks);

    // Susun output yang gampang dibaca & tidak meledak kalau salah satu error
    const summary = settled.map((s) => {
      if (s.status === 'fulfilled') return s.value;
      // kalau rejected, kasih pesan aman
      return {
        tag: 'unknown',
        ok: false,
        error: s.reason?.message || String(s.reason || 'Unknown error'),
      };
    });

    // Tentukan status HTTP: kalau ada yang ok, 200; kalau semua gagal, 500
    const anyOk = summary.some((x) => x.ok);
    const httpStatus = anyOk ? 200 : 500;

    return res.status(httpStatus).json({
      ok: anyOk,
      mode,
      runs: summary,
      ts: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Cron Executor Fatal Error:', err);
    return res.status(500).json({
      ok: false,
      mode,
      error: err?.message || 'fatal_error',
    });
  }
}