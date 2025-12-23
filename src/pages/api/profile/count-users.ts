import { userUseCase } from '@/features/profile/application/use-cases/userUsecase';
import { Messages } from '@/shared/constants';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createErrorResponse } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { KYCStatus } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default withAuthorization({
  GET: ['Admin', 'CS'],
})((req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      return GET(req, res);
    default:
      return res
        .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
        .json(createResponse(RESPONSE_CODE.METHOD_NOT_ALLOWED, Messages.METHOD_NOT_ALLOWED));
  }
});

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { eKycStatus } = req.query;

    let status = eKycStatus as KYCStatus;

    //default status is PENDING
    if (!status) {
      status = KYCStatus.PENDING;
    }

    const result = await userUseCase.getCountUserEkycByStatus(status);
    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, Messages.GET_COUNT_USER_SUCCESS, result));
  } catch (error) {
    console.error('Get list user error:', error);
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.INTERNAL_SERVER_ERROR, Messages.GET_LIST_USER_ERROR));
  }
}
