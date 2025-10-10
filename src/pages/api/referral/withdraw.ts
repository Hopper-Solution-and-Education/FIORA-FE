import { referralUseCase } from '@/features/referral/application/use-cases/referralUseCase';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import type { NextApiRequest, NextApiResponse } from 'next';

export default sessionWrapper((req: NextApiRequest, res: NextApiResponse, userId: string) =>
  errorHandler(
    async (request, response) => {
      if (request.method !== 'POST') {
        return response
          .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
          .json(createResponse(RESPONSE_CODE.METHOD_NOT_ALLOWED, 'Method not allowed', null));
      }

      const { amount, minThreshold } = request.body || {};
      const parsedAmount = Number(amount);
      if (!parsedAmount || parsedAmount <= 0) {
        return response
          .status(RESPONSE_CODE.BAD_REQUEST)
          .json(createResponse(RESPONSE_CODE.BAD_REQUEST, 'amount must be > 0', null));
      }

      const result = await referralUseCase.withdraw(userId, parsedAmount, {
        minThreshold: typeof minThreshold === 'number' ? minThreshold : undefined,
      });

      return response.status(RESPONSE_CODE.OK).json(createResponse(RESPONSE_CODE.OK, 'OK', result));
    },
    req,
    res,
  ),
);
