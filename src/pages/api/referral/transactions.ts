import { ReferralTransactionType } from '@/features/referral';
import { referralUseCase } from '@/features/referral/application/use-cases/referralUseCase';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import type { NextApiRequest, NextApiResponse } from 'next';

export default sessionWrapper((req: NextApiRequest, res: NextApiResponse, userId: string) =>
  errorHandler(
    async (request, response) => {
      if (request.method !== 'GET') {
        return response
          .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
          .json(createResponse(RESPONSE_CODE.METHOD_NOT_ALLOWED, 'Method not allowed', null));
      }
      const { limit, page, pageSize, type, search, fromDate, toDate } = request.query;

      // Parse pagination parameters
      const paginationParams = {
        page: page ? Number(page) : undefined,
        pageSize: pageSize ? Number(pageSize) : undefined,
        limit: limit ? Number(limit) : undefined,
      };

      // Parse filter parameters
      const filters = {
        type: type
          ? ((Array.isArray(type) ? type : [type]) as ReferralTransactionType[])
          : undefined,
        search: search as string | undefined,
        fromDate: fromDate ? new Date(fromDate as string) : undefined,
        toDate: toDate ? new Date(toDate as string) : undefined,
      };

      // Use paginated version if page and pageSize are provided
      const data =
        paginationParams.page && paginationParams.pageSize
          ? await referralUseCase.getWalletTransactionsPaginated(
              userId,
              paginationParams.page,
              paginationParams.pageSize,
              filters,
            )
          : await referralUseCase.getWalletTransactions(
              userId,
              paginationParams.limit || 50,
              filters,
            );

      return response.status(RESPONSE_CODE.OK).json(createResponse(RESPONSE_CODE.OK, 'OK', data));
    },
    req,
    res,
  ),
);
