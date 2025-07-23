import { prisma } from '@/config';
import { SectionTypeEnum } from '@/features/landing/constants';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const sectionType = req.query.sectionType as SectionTypeEnum;

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
        media_url_2: true,
        embed_code: true,
        description: true,
        uploaded_by: true,
        uploaded_date: true,
        section: {
          select: {
            section_type: true,
          },
        },
        mediaReviewUser: {
          select: {
            media_user_name: true,
            media_user_avatar: true,
            media_user_title: true,
            media_user_email: true,
            media_user_comment: true,
            media_user_rating: true,
            createdBy: true,
            updatedBy: true,
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
