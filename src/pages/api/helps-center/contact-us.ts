import { contactUsUseCase } from '@/features/helps-center/application/use-cases/contact-us/contactUsUseCase';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { createErrorResponse } from '@/shared/lib/utils';
import { validateBody } from '@/shared/utils/validate';
import { contactUsSchema } from '@/shared/validators/contactUsValidator';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      return POST(req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Validate request body
    const { error, value } = validateBody(contactUsSchema, req.body);

    if (error) {
      return res
        .status(RESPONSE_CODE.BAD_REQUEST)
        .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, error));
    }

    // Execute the contact us use case
    const result = await contactUsUseCase.execute(value);

    if (!result) {
      return res
        .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        .json(createErrorResponse(RESPONSE_CODE.INTERNAL_SERVER_ERROR, Messages.INTERNAL_ERROR));
    }

    // Return success response
    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, Messages.SEND_SUCCESS, result));
  } catch (error) {
    console.error('Contact Us API Error:', error);

    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message === 'No admin user found') {
        return res
          .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
          .json(createErrorResponse(RESPONSE_CODE.INTERNAL_SERVER_ERROR, Messages.INTERNAL_ERROR));
      }
    }

    // Generic error response
    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(createErrorResponse(RESPONSE_CODE.INTERNAL_SERVER_ERROR, Messages.INTERNAL_ERROR));
  }
}
