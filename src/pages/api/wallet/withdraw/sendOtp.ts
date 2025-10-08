import { walletWithdrawUsecase } from '@/features/wallet-withdraw/application/walletWithdrawUsecase';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { UserRole } from '@/shared/constants/userRole';
import { errorHandler } from '@/shared/lib';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { NextApiRequest, NextApiResponse } from 'next';
import { createResponse } from './../../../../shared/lib/responseUtils/createResponse';

export default withAuthorization({
  POST: [UserRole.USER],
  PUT: [UserRole.USER],
  GET: [UserRole.USER],
})((request: NextApiRequest, response: NextApiResponse, userId: string) =>
  errorHandler(
    async (request, response) => {
      switch (request.method) {
        // case 'GET':
        //   return GET(request, response, userId);
        case 'POST':
          return POST(request, response, userId);
        // case 'PUT':
        //   return PUT(request, response, userId);
        default:
          return response
            .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
            .json({ error: Messages.METHOD_NOT_ALLOWED });
      }
    },
    request,
    response,
  ),
);

export async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const withdrawResponse = await walletWithdrawUsecase.sendOtpWithDraw(userId);
  return res
    .status(RESPONSE_CODE.CREATED)
    .json(createResponse(RESPONSE_CODE.CREATED, Messages.SEND_OTP_SUCESSFULL, withdrawResponse));
}
