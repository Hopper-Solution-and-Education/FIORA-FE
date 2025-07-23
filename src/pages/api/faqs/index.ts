import { createFaqUseCase } from '@/features/faqs/application/use-cases/createFaqUseCase';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createError, createResponse } from '@/shared/lib/responseUtils/createResponse';
import { createErrorResponse } from '@/shared/lib/utils';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { validateBody } from '@/shared/utils/validate';
import { faqCreateSchema } from '@/shared/validators/faqValidator';
import type { NextApiRequest, NextApiResponse } from 'next';

export default withAuthorization({
  POST: ['Admin', 'CS'],
})(async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
  switch (req.method) {
    case 'POST':
      return POST(req, res, userId);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
});

async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { error, value } = validateBody(faqCreateSchema, req.body);

    if (error) {
      return res
        .status(RESPONSE_CODE.BAD_REQUEST)
        .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, error));
    }

    const { title, description, content, categoryId } = value;

    const faq = await createFaqUseCase.execute({
      title,
      description,
      content,
      categoryId,
      userId,
    });

    return res
      .status(RESPONSE_CODE.CREATED)
      .json(createResponse(RESPONSE_CODE.CREATED, Messages.CREATE_FAQ_SUCCESS, faq));
  } catch (error: any) {
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
