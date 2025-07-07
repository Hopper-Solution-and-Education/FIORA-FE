import { NextApiRequest, NextApiResponse } from 'next';
import { getFaqCategoriesUseCase } from '@/features/faqs/di/container';
import { createError } from '@/shared/lib/responseUtils/createResponse';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { Messages } from '@/shared/constants/message';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return createError(res, RESPONSE_CODE.METHOD_NOT_ALLOWED, Messages.METHOD_NOT_ALLOWED);
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
