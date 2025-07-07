import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { categoryId } = req.query;

  if (!categoryId || typeof categoryId !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid categoryId' });
  }

  const faqs = await prisma.post.findMany({
    where: {
      categoryId,
      type: 'FAQ',
    },
    orderBy: { createdAt: 'desc' },
  });

  return res.status(200).json(faqs);
}
