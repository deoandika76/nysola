// pages/api/cron-execute.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { executeAutoTask } from '../../utils/executor';
import { processOneFaucetJob } from '../../utils/faucetRunner';

type RunMode = 'auto' | 'faucet' | 'both';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end('Only GET allowed');

  const mode = (req.query.run as RunMode) || 'both';

  try {
    const wrap = (tag: string, p: Promise<any>) =>
      p
        .then((r) => ({ tag, ok: true, result: r }))
        .catch((e) => ({
          tag,
          ok: false,
          error: e?.message || String(e || 'Unknown error'),
        }));

    const tasks: Promise<any>[] = [];
    if (mode === 'auto' || mode === 'both') tasks.push(wrap('autoTask', executeAutoTask()));
    if (mode === 'faucet' || mode === 'both') tasks.push(wrap('faucet', processOneFaucetJob()));

    if (tasks.length === 0) {
      return res.status(200).json({ ok: true, message: 'Nothing to run' });
    }

    const runs = await Promise.all(tasks);
    const anyOk = runs.some((x) => x.ok);

    // Jika ada indikasi quota/limit dari salah satu run, kembalikan 429 agar cron bisa tahu untuk pause
    const quotaHit = runs.some((x) =>
      String(x.error || '')
        .toLowerCase()
        .includes('resource-exhausted') ||
      String(x.error || '').toLowerCase().includes('quota')
    );

    const code = quotaHit ? 429 : anyOk ? 200 : 500;

    return res.status(code).json({
      ok: anyOk && !quotaHit,
      quotaHit,
      mode,
      runs,
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