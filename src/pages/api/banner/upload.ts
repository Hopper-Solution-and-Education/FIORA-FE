// import prisma from '@/infrastructure/database/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { media_url, media_type } = req.body;

  if (!media_url || !media_type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // try {
  //   // Tạo Media record
  //   const media = await prisma.media.create({
  //     data: {
  //       media_url,
  //       media_type,
  //     },
  //   });

  //   // Tạo Banner record
  //   const banner = await prisma.banner.create({
  //     data: {
  //       media_id: media.media_id,
  //       order: 0,
  //     },
  //   });

  //   return res.status(201).json({ success: true, banner });
  // } catch (error) {
  //   return res.status(500).json({ error: 'Something went wrong' });
  // }
}
