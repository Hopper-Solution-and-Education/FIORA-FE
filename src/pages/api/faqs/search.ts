import { createError } from '@/shared/lib/responseUtils/createResponse';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { NextApiRequest, NextApiResponse } from 'next';
import { getFaqsListUseCase } from '@/features/faqs/di/container';
import { FaqsGetListType, FaqsListQueryParams } from '@/features/faqs/domain/entities/models/faqs';

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
  try {
    let faqsListResponse;

    if (req.body.type === FaqsGetListType.LIST) {
      // Get most viewed FAQs
      faqsListResponse = await getFaqsListUseCase.execute(req.body as FaqsListQueryParams, userId);
    } else if (req.body.type === FaqsGetListType.CATEGORIES) {
      // Get all categories with their FAQs
      faqsListResponse = await getFaqsListUseCase.executeByCategories(
        {
          limit: req.body.limit || 4,
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
