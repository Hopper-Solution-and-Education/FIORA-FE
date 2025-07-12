import { prisma } from '@/config';
import { getFaqCategoriesUseCase } from '@/features/faqs/di/container';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { Messages } from '@/shared/constants/message';
import { createError } from '@/shared/lib/responseUtils/createResponse';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return createError(res, RESPONSE_CODE.METHOD_NOT_ALLOWED, Messages.METHOD_NOT_ALLOWED);
  }

  if (req.method === 'POST') {
    return withAuthorization({
      POST: ['Admin', 'User'],
    })(async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
      const { name, description } = req.body;
      const category = await prisma.postCategory.create({
        data: {
          name,
          description,
          type: 'FAQ',
          createdBy: userId,
        },
      });
      return res.status(200).json({
        data: category,
        status: 200,
      });
    });
  }

  try {
    const categories = await getFaqCategoriesUseCase.execute();

    return res.status(200).json({
      data: categories,
      status: 200,
    });
  } catch (error) {
    console.error('Error fetching FAQ categories:', error);

    return res.status(200).json({
      message: Messages.GET_FAQ_CATEGORIES_FAILED,
      data: [],
      status: 200,
    });
  }
}
