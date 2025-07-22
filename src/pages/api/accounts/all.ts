import { GetPaginatedAccountsUseCase } from '@/features/auth/application/use-cases/getPaginatedAccountsUseCase';
import { AccountRepository } from '@/features/auth/infrastructure/repositories/accountRepository';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

const accountRepository = new AccountRepository();
const getPaginatedAccountsUseCase = new GetPaginatedAccountsUseCase(accountRepository);

// Define the expected session structure

export default sessionWrapper(async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
  // Get the session using NextAuth's getServerSession

  try {
    switch (req.method) {
      case 'GET':
        return GET(req, res, userId);
      default:
        return res
          .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
          .json({ error: 'Phương thức không được hỗ trợ' });
    }
  } catch (error: any) {
    return res.status(RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
});

export async function GET(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { page = '1', pageSize = '40', search = '' } = req.query;

    const pageNumber = parseInt(page as string);
    const pageSizeNumber = parseInt(pageSize as string);
    const searchQuery = search as string;

    const { accounts, total } = await getPaginatedAccountsUseCase.execute({
      userId,
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
  } catch (error: any) {
    res.status(RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}
