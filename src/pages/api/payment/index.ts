import { paymentWalletUseCase } from '@/features/payment-wallet/application/use-cases/paymentWalletUseCase';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { errorHandler } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

export const maxDuration = 30; // 30 seconds

export default sessionWrapper((req, res, userId) =>
  errorHandler(
    async (request, response) => {
      switch (request.method) {
        case 'POST':
          return POST(request, response, userId);
        default:
          return response
            .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
            .json({ error: Messages.METHOD_NOT_ALLOWED });
      }
    },
    req,
    res,
  ),
);

export async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { filters, page, pageSize, search } = req.body;

  const fetchPaymentWallet = await paymentWalletUseCase.fetchPaymentWallet({
    page,
    pageSize,
    filters,
    searchParams: search,
  });

  return res
    .status(RESPONSE_CODE.CREATED)
    .json(createResponse(RESPONSE_CODE.CREATED, Messages.GET_TRANSACTION_SUCCESS, transactions));
}
