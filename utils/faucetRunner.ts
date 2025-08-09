// utils/faucetRunner.ts
import { addDoc, collection, deleteDoc, doc, getDocs, limit, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { FaucetJob, getAdapterByChain } from './faucetAdapters';

export async function enqueueFaucetJob(job: FaucetJob) {
  await addDoc(collection(db, 'faucetQueue'), {
    ...job,
    createdAt: Date.now(),
    status: 'queued',
  });
}

export async function processOneFaucetJob() {
  // Ambil 1 antrian tertua
  const q = query(collection(db, 'faucetQueue'), orderBy('createdAt', 'asc'), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return 'Queue empty';

  const docRef = snap.docs[0].ref;
  const job = snap.docs[0].data() as FaucetJob;

  const adapter = getAdapterByChain(job.chain);
  if (!adapter) {
    await addDoc(collection(db, 'faucetLogs'), {
      job, ok: false, error: 'adapter_not_found', createdAt: serverTimestamp(),
    });
    await deleteDoc(docRef);
    return 'Adapter not found';
  }

  const res = await adapter.requestTopup(job.wallet);

  await addDoc(collection(db, 'faucetLogs'), {
    job,
    adapter: adapter.name,
    result: res,
    createdAt: serverTimestamp(),
  });

  await deleteDoc(docRef);

  if (res.ok) return `OK: ${adapter.name} → ${job.wallet}`;
  return `PENDING/MANUAL: ${adapter.name} → ${res.error}`;
}