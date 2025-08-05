import { GetPaginatedAccountsUseCase } from '@/features/auth/application/use-cases/getPaginatedAccountsUseCase';
import { AccountRepository } from '@/features/auth/infrastructure/repositories/accountRepository';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { Currency } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const accountRepository = new AccountRepository();
const getPaginatedAccountsUseCase = new GetPaginatedAccountsUseCase(accountRepository);

// Define the expected session structure

export default sessionWrapper((req: NextApiRequest, res: NextApiResponse, userId: string) =>
  errorHandler(
    async (request, response) => {
      switch (request.method) {
        case 'GET':
          return GET(request, response, userId);
        default:
          return response
            .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
            .json({ error: 'Phương thức không được hỗ trợ' });
      }
    },
    req,
    res,
  ),
);

export async function GET(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const currency = (req.headers['x-user-currency'] as string as Currency) ?? Currency.VND;
  const { page = '1', pageSize = '40', search = '' } = req.query;

  const pageNumber = parseInt(page as string);
  const pageSizeNumber = parseInt(pageSize as string);
  const searchQuery = search as string;

  const { accounts, total } = await getPaginatedAccountsUseCase.execute({
    userId,
    currency,
    page: pageNumber,
    pageSize: pageSizeNumber,
    search: searchQuery,
  });

  return res.status(RESPONSE_CODE.OK).json(
    createResponse(RESPONSE_CODE.OK, 'Accounts retrieved successfully', {
      accounts,
      pagination: {
        page: pageNumber,
        pageSize: pageSizeNumber,
        total,
        hasMore: total > pageNumber * pageSizeNumber,
      },
    }),
  );
}
