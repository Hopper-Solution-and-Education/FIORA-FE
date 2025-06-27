import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, PostType, UserRole } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { v4 as uuidv4 } from 'uuid';
import { authOptions } from '../../auth/[...nextauth]';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const categories = await prisma.postCategory.findMany({
      select: { id: true, name: true },
      where: { type: PostType.FAQ },
    });
    return res.status(200).json(categories);
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id: userId, role } = session.user as { id: string; role: UserRole };
  if (role !== UserRole.Admin && role !== UserRole.CS) {
    return res.status(403).json({ message: 'Permission denied' });
  }
  const { title, description, content, categoryId, attachmentIds } = req.body;
  if (!title || !content || !categoryId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  const existed = await prisma.post.findFirst({
    where: { title, type: PostType.FAQ },
  });
  if (existed) {
    return res.status(409).json({ message: 'FAQ title already exists' });
  }

  try {
    const post = await prisma.post.create({
      data: {
        id: uuidv4(),
        title,
        description,
        content,
        type: PostType.FAQ,
        categoryId,
        userId,
        createdBy: userId,
        updatedAt: new Date(),
      },
    });

    if (Array.isArray(attachmentIds) && attachmentIds.length > 0) {
      await prisma.attachmentRelations.createMany({
        data: attachmentIds.map((attachmentId: string) => ({
          id: uuidv4(),
          postId: post.id,
          userId,
          createdBy: userId,
          attachmentId,
          updatedAt: new Date(),
        })),
      });
    }

    return res.status(201).json({ message: 'FAQ created', post });
  } catch (error: any) {
    console.error('FAQ creation error:', error);
    return res.status(500).json({
      message: error?.message || 'Server error',
      stack: error?.stack,
      error,
    });
  }
}
