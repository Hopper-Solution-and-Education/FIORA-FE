import { sendingWalletUseCase } from '@/features/sending-wallet/application/use-cases/sendingWalletUseCase';
import { Messages } from '@/shared/constants';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { errorHandler } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

export default withAuthorization({
  POST: ['User', 'Admin', 'CS'],
})(async (req: NextApiRequest, res: NextApiResponse, userId: string) =>
  errorHandler(
    async (req, res) => {
      switch (req.method) {
        case 'POST':
          return POST(req, res, userId);
        default:
          return res
            .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
            .json({ error: Messages.METHOD_NOT_ALLOWED });
      }
    },
    req,
    res,
  ),
);

export async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const data = req.body;

  await sendingWalletUseCase.sendOTP({
    amount: data.amount,
    emailReceiver: data.emailReceiver,
    userId,
  });

  return res
    .status(RESPONSE_CODE.OK)
    .json(createResponse(RESPONSE_CODE.OK, 'Sending OTP is successfully'));
}
