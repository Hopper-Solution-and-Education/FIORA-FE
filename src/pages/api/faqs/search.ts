import { createError } from '@/shared/lib/responseUtils/createResponse';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { NextApiRequest, NextApiResponse } from 'next';
import { getFaqsListUseCase } from '@/features/faqs/di/container';

export default withAuthorization({
  POST: ['User', 'Admin', 'CS'],
  GET: ['User', 'Admin', 'CS'],
})(async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
  switch (req.method) {
    case 'POST':
      return POST(req, res, userId);

    default:
      return res
        .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
        .json({ error: 'Phương thức không được hỗ trợ' });
  }
});

export async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { type, categoryId, limit, search, filters } = req.body;

  try {
    let faqsListResponse;

    if (type === 'most-viewed') {
      // Get most viewed FAQs
      faqsListResponse = await getFaqsListUseCase.execute(
        {
          orderBy: 'views',
          limit: limit || 8,
          search,
        },
        userId,
      );
    } else if (type === 'by-categories') {
      // Get all categories with their FAQs
      faqsListResponse = await getFaqsListUseCase.executeByCategories(
        {
          limit: limit || 4,
          search,
        },
        userId,
      );
    } else if (type === 'by-category' && categoryId) {
      // Get all FAQs from a specific category
      faqsListResponse = await getFaqsListUseCase.execute(
        {
          category: [categoryId],
          search,
        },
        userId,
      );
    } else if (filters) {
      // Legacy support: search with filters
      faqsListResponse = await getFaqsListUseCase.execute(
        {
          category: filters?.categories,
          type: filters?.type,
          search: filters?.search,
        },
        userId,
      );
    } else {
      // Default: get all FAQs
      faqsListResponse = await getFaqsListUseCase.execute(
        {
          search,
        },
        userId,
      );
    }

    // Return response
    return res.status(200).json({
      message: 'FAQs retrieved successfully',
      data: faqsListResponse,
      status: 200,
    });
  } catch (error: any) {
    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(
        createError(
          res,
          RESPONSE_CODE.INTERNAL_SERVER_ERROR,
          error.message || Messages.INTERNAL_ERROR,
        ),
      );
  }
}
