import { paymentWalletUseCase } from '@/features/payment-wallet/application/use-cases/paymentWalletUseCase';
import { Messages } from '@/shared/constants';
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
        case 'GET':
          return GET(request, response, userId);
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

export async function GET(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const fetchPaymentWallet = await paymentWalletUseCase.fetchPaymentWalletDashboardMetrics(userId);
  return res
    .status(RESPONSE_CODE.OK)
    .json(
      createResponse(
        RESPONSE_CODE.OK,
        Messages.FETCH_PAYMENT_WALLET_DASHBOARD_METRICS_SUCCESS,
        fetchPaymentWallet,
      ),
    );
}

export async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { filters, pageSize, search, lastCursor, sortBy } = req.body;

  const fetchPaymentWallet = await paymentWalletUseCase.fetchPaymentWallet(userId, {
    pageSize,
    filters,
    searchParams: search,
    lastCursor,
    sortBy,
  });

  return res
    .status(RESPONSE_CODE.OK)
    .json(
      createResponse(
        RESPONSE_CODE.OK,
        Messages.GET_PAYMENT_WALLET_DETAILS_SUCCESS,
        fetchPaymentWallet,
      ),
    );
}
