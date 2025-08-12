import { prisma } from '@/config';
import { SectionTypeEnum } from '@/features/landing/constants';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) =>
  errorHandler(
    async (request, response) => {
      if (request.method !== 'GET') {
        return response.status(405).json({ message: 'Method Not Allowed' });
      }

      const sectionType = request.query.sectionType as SectionTypeEnum;

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

      return response.status(200).json(images);
    },
    req,
    res,
  );
