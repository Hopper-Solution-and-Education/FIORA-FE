import { getFaqCategoriesUseCase } from '@/features/faqs/application/use-cases';
import { PostType } from '@/features/faqs/domain/entities/models/faqs';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { Messages } from '@/shared/constants/message';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return GET(req, res);

    default:
      return res
        .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
        .json({ error: Messages.METHOD_NOT_ALLOWED });
  }
}

async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { type, limit } = req.query;
    const categories = await getFaqCategoriesUseCase.executeWithPost({
      type: type as PostType,
      limit: limit ? parseInt(limit as string) : undefined,
    });

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
