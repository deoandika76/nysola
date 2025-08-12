// utils/faucetRunner.ts
import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { FaucetJob } from './faucetAdapters';
import { getAdapterByChain } from './faucetAdapters';

/**
 * Masukkan 1 pekerjaan faucet ke antrian.
 * Simpel: {wallet, chain, createdAt, status}
 */
export async function enqueueFaucetJob(job: FaucetJob) {
  if (!job?.wallet || !job?.chain) {
    throw new Error('invalid_job_payload');
  }
  await addDoc(collection(db, 'faucetQueue'), {
    ...job,
    createdAt: Date.now(),
    status: 'queued',
  });
}

/**
 * Ambil 1 job tertua → jalankan adapter → log → hapus dari queue.
 * Return string ringkas untuk keperluan cron logging.
 */
export async function processOneFaucetJob() {
  // 1) Ambil antrian tertua (maks 1)
  const q = query(collection(db, 'faucetQueue'), orderBy('createdAt', 'asc'), limit(1));
  const snap = await getDocs(q);

  if (snap.empty) return 'Queue empty';

  const docSnap = snap.docs[0];
  const docRef = docSnap.ref;
  const job = docSnap.data() as FaucetJob;

  // 2) Cari adapter
  const adapter = getAdapterByChain(job.chain);
  if (!adapter) {
    await addDoc(collection(db, 'faucetLogs'), {
      job,
      ok: false,
      error: 'adapter_not_found',
      createdAt: serverTimestamp(),
    });
    await deleteDoc(docRef);
    return `Adapter not found (${job.chain})`;
  }

  // 3) Jalankan adapter (dibungkus biar gak meledak)
  let res: { ok: boolean; txHash?: string; error?: string; note?: string } = {
    ok: false,
    error: 'unknown',
  };

  try {
    res = await adapter.requestTopup(job.wallet);
  } catch (e: any) {
    res = { ok: false, error: e?.message || 'adapter_throw' };
  }

  // 4) Tulis log ringkas (hemat kuota)
  await addDoc(collection(db, 'faucetLogs'), {
    job,
    adapter: adapter.name,
    ok: res.ok,
    txHash: res.txHash,
    error: res.error,
    note: res.note?.slice(0, 200),
    createdAt: serverTimestamp(),
  });

  // 5) Hapus dari queue (selesai / tercatat)
  await deleteDoc(docRef);

  // 6) Balikan ringkas ke caller (cron / endpoint manual)
  if (res.ok) {
    return `OK: ${adapter.name} → ${job.wallet}${res.txHash ? ` (${res.txHash.slice(0, 10)}…)` : ''}`;
  }
  return `PENDING/MANUAL: ${adapter.name} → ${job.wallet}${res.error ? ` [${res.error}]` : ''}`;
}