import { NextApiRequest, NextApiResponse } from 'next';
import { partnerUseCase } from '@/features/partner/application/use-cases/partnerUseCase';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createError, createResponse } from '@/shared/lib/responseUtils/createResponse';
import { Messages } from '@/shared/constants/message';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';

export default withAuthorization({
  GET: ['User', 'Admin', 'CS'],
  POST: ['User', 'Admin', 'CS'],
  PUT: ['User', 'Admin', 'CS'],
  DELETE: ['Admin'],
})(async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
  switch (req.method) {
    case 'POST':
      return POST(req, res, userId);
    case 'GET':
      return GET(req, res, userId);
    default:
      return res
        .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
        .json({ error: Messages.METHOD_NOT_ALLOWED });
  }
});

export async function GET(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const partners = await partnerUseCase.listPartners(userId);
    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, Messages.GET_PARTNER_SUCCESS, partners));
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

export async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const newPartner = await partnerUseCase.createPartner({ ...req.body, userId });
    return res
      .status(RESPONSE_CODE.CREATED)
      .json(createResponse(RESPONSE_CODE.CREATED, Messages.CREATE_PARTNER_SUCCESS, newPartner));
  } catch (error: any) {
    // Check if this is a validation error object
    if (error.validationErrors) {
      return res.status(RESPONSE_CODE.BAD_REQUEST).json(
        createResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, {
          errors: error.validationErrors,
        }),
      );
    }

    // Handle other errors
    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(
        createResponse(
          RESPONSE_CODE.INTERNAL_SERVER_ERROR,
          error.message || Messages.INTERNAL_ERROR,
          null,
        ),
      );
  }
}
