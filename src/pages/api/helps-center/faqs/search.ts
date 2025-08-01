import { getFaqListUseCase } from '@/features/helps-center/application/use-cases/faq';
import { FaqsListQueryParams } from '@/features/helps-center/domain/entities/models/faqs';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createError, createResponse } from '@/shared/lib/responseUtils/createResponse';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      return POST(req, res);
    default:
      return createError(res, RESPONSE_CODE.METHOD_NOT_ALLOWED, Messages.METHOD_NOT_ALLOWED);
  }
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get most viewed FAQs
    const faqsListResponse = await getFaqListUseCase.execute(req.body as FaqsListQueryParams);

    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, Messages.GET_FAQ_LIST_SUCCESS, faqsListResponse));
  } catch (error: any) {
    if (error.validationErrors) {
      return res.status(RESPONSE_CODE.BAD_REQUEST).json({
        status: RESPONSE_CODE.BAD_REQUEST,
        message: Messages.VALIDATION_ERROR,
        error: error.validationErrors,
      });
    }
    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(
        createError(
          res,
          RESPONSE_CODE.INTERNAL_SERVER_ERROR,
          error?.message || Messages.INTERNAL_ERROR,
        ),
      );
  }
}
