import { walletWithdrawUsecase } from '@/features/wallet-withdraw/application/walletWithdrawUsecase';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { UserRole } from '@/shared/constants/userRole';
import { errorHandler } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

export default withAuthorization({
  POST: [UserRole.USER],
  PUT: [UserRole.USER],
  GET: [UserRole.USER],
})((request: NextApiRequest, response: NextApiResponse, userId: string) =>
  errorHandler(
    async (request, response) => {
      switch (request.method) {
        case 'GET':
          return GET(request, response, userId);
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

export async function GET(req: NextApiRequest, res: NextApiResponse, userId: string) {
  console.log('userId', userId);
  const walletWithdrawData = await walletWithdrawUsecase.getWalletWithdraw(userId);
  console.log('walletWithdrawData', walletWithdrawData);
  return res
    .status(RESPONSE_CODE.OK)
    .json(
      createResponse(RESPONSE_CODE.OK, Messages.GET_WALLET_WITHDRAW_SUCCESS, walletWithdrawData),
    );
}
export async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { amount, otp } = req.body;
  if (!amount || isNaN(amount) || amount <= 0) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createResponse(RESPONSE_CODE.BAD_REQUEST, Messages.INVALID_AMOUNT, null));
  }
  const withdrawResponse = await walletWithdrawUsecase.createWithdraw(userId, amount, otp);
  return res
    .status(RESPONSE_CODE.CREATED)
    .json(
      createResponse(RESPONSE_CODE.CREATED, Messages.WITHDRAW_REQUEST_SUCCESS, withdrawResponse),
    );
}
