import { exchangeRateUseCase } from '@/features/setting/api/domain/use-cases/exchangeRateUsecase';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createError, createResponse } from '@/shared/lib/responseUtils/createResponse';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

export default sessionWrapper(async (req, res) => {
  switch (req.method) {
    case 'GET':
      return GET(req, res);
    default:
      return res.status(RESPONSE_CODE.METHOD_NOT_ALLOWED).json({ error: 'Method is not allowed' });
  }
});

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const exchangeRateList = await exchangeRateUseCase.getAllCurrencyExchangeName();
    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, Messages.GET_EXCHANGE_RATE_SUCCESS, exchangeRateList));
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
