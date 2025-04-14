import { prisma } from '@/config';
import { SectionType } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const sectionType = req.query.sectionType as SectionType;

    const whereCondition = {
      section: {
        section_type: sectionType,
      },
    };

    const images = await prisma.media.findMany({
      where: whereCondition,
      orderBy: {
        uploaded_date: 'desc',
      },
      take: 10,
      select: {
        id: true,
        media_url: true,
        embed_code: true,
        description: true,
        uploaded_by: true,
        uploaded_date: true,
        section: {
          select: {
            section_type: true,
          },
        },
      },
    });

    return res.status(200).json(images);
  } catch (error) {
    console.error('Error fetching media:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
