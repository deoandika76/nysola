import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../lib/firebase' // ganti path ini sesuai struktur kamu
import { addDoc, collection, Timestamp } from 'firebase/firestore'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const { message, type } = req.body

  if (!message || !type) {
    return res.status(400).json({ message: 'Missing message or type' })
  }

  try {
    await addDoc(collection(db, 'notifications'), {
      message,
      type,
      timestamp: Timestamp.now(),
    })

    return res.status(200).json({ success: true, message: 'Notification logged' })
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message })
  }
}