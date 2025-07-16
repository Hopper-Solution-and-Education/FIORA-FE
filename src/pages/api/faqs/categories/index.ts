import { prisma } from '@/config';
import { getFaqCategoriesUseCase } from '@/features/faqs/application/use-cases';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { Messages } from '@/shared/constants/message';
import { createError, createResponse } from '@/shared/lib/responseUtils/createResponse';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

export default sessionWrapper(async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
  switch (req.method) {
    case 'GET':
      return GET(req, res);
    case 'POST':
      return POST(req, res, userId);
  }
});

async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const categories = await getFaqCategoriesUseCase.execute();
    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, Messages.GET_FAQ_CATEGORIES_SUCCESS, categories));
  } catch (error) {
    console.error('Error fetching FAQ categories:', error);
    return createError(
      res,
      RESPONSE_CODE.INTERNAL_SERVER_ERROR,
      Messages.GET_FAQ_CATEGORIES_FAILED,
    );
  }
}

async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  if (!userId) {
    return createError(res, RESPONSE_CODE.UNAUTHORIZED, Messages.UNAUTHORIZED);
  }
  const { name, description } = req.body;
  try {
    const category = await prisma.postCategory.create({
      data: {
        name,
        description,
        type: 'FAQ',
        createdBy: userId,
      },
    });
    return res
      .status(RESPONSE_CODE.CREATED)
      .json(createResponse(RESPONSE_CODE.CREATED, Messages.CREATE_FAQ_CATEGORY_SUCCESS, category));
  } catch (error) {
    console.error('Error creating FAQ category:', error);
    return createError(
      res,
      RESPONSE_CODE.INTERNAL_SERVER_ERROR,
      Messages.CREATE_FAQ_CATEGORY_FAILED,
    );
  }
}
