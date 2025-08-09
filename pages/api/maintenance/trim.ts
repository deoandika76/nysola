// pages/api/maintenance/trim.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';

// Koleksi yang aman untuk dibersihkan berkala
const COLLECTIONS = ['notifications', 'txHistory', 'autoTaskLogs', 'faucetResults'];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end('Only GET allowed');

  const daysParam = Number(req.query.days);
  const days = Number.isFinite(daysParam) && daysParam > 0 ? daysParam : 7;
  const cutoff = Timestamp.fromDate(new Date(Date.now() - days * 24 * 60 * 60 * 1000));

  try {
    const results: any[] = [];
    for (const name of COLLECTIONS) {
      const q = query(collection(db, name), where('timestamp', '<', cutoff));
      const snap = await getDocs(q);
      let deleted = 0;
      for (const d of snap.docs) {
        await deleteDoc(doc(db, name, d.id));
        deleted++;
      }
      results.push({ collection: name, deleted });
    }

    res.status(200).json({
      ok: true,
      cutoff: cutoff.toDate(),
      results,
    });
  } catch (e: any) {
    console.error('Trim error:', e);
    res.status(500).json({ ok: false, error: e?.message || 'unknown_error' });
  }
}