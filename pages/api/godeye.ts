// pages/api/godeye.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'No prompt provided' });

  const apiKey = process.env.GODEYE_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GODEYE_API_KEY is missing in env' });

  try {
    // 🧠 FETCH MEMORY DATA FROM FIREBASE
    const [walletSnap, rewardSnap, hunterSnap] = await Promise.all([
      getDocs(collection(db, 'wallets')),
      getDocs(collection(db, 'rewards')).catch(() => ({ docs: [] })), // optional
      getDocs(collection(db, 'hunterMissions')).catch(() => ({ docs: [] })),
    ]);

    const wallets = walletSnap.docs.map((doc) => doc.data());
    const rewards = rewardSnap.docs.map((doc) => doc.data());
    const hunters = hunterSnap.docs.map((doc) => doc.data());

    // 🧠 BUILD MEMORY
    const memory: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      {
        role: 'system',
        content:
          `Kamu adalah GOD EYE — AI utama dari sistem NYSOLA.\n` +
          `Fokusmu: mencari cuan tanpa modal di Web3 (airdrop, testnet, farming, dll).\n\n` +
          `📦 Wallet Aktif: ${wallets.map((w) => w.address).join(', ') || 'Tidak ada'}\n` +
          `🎁 Total Reward Masuk: ${rewards.length || 0}\n` +
          `🎯 Status Misi Hunter: ${hunters.length > 0 ? hunters.map((h) => `${h.title || 'Misi'}: ${h.status || 'belum dikerjakan'}`).join(' | ') : 'Belum ada'}`
      },
      {
        role: 'system',
        content:
          `User akan memberi perintah untuk memeriksa sistem, memberi saran, atau menjalankan task.\n` +
          `Balas dengan ringkas, jelas, dan berorientasi hasil.`
      }
    ];

    // 🧠 CALL GPT-4o
    const apiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [...memory, { role: 'user', content: prompt }],
      }),
    });

    const data = await apiRes.json();

    if (!apiRes.ok) {
      console.error('OpenAI API error:', data);
      return res.status(apiRes.status).json({ error: data.error?.message || 'OpenAI error' });
    }

    const reply = data.choices?.[0]?.message?.content || '❌ Tidak ada respon dari AI';
    res.status(200).json({ result: reply });
  } catch (err: any) {
    console.error('Unexpected Error:', err);
    res.status(500).json({ error: 'GOD EYE mengalami error tak terduga' });
  }
}