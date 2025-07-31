// pages/api/godeye.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'No prompt provided' });

  const apiKey = process.env.GODEYE_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GODEYE_API_KEY is missing in env' });

  try {
    const apiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await apiRes.json();

    if (!apiRes.ok) {
      console.error('OpenAI API error:', data);
      return res.status(apiRes.status).json({ error: data.error?.message || 'OpenAI error' });
    }

    const reply = data.choices?.[0]?.message?.content || '❌ No content from OpenAI';
    res.status(200).json({ result: reply });
  } catch (err: any) {
    console.error('Unexpected Error:', err);
    res.status(500).json({ error: 'GOD EYE mengalami error tak terduga' });
  }
}