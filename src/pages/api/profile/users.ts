import { getUsersUseCase } from '@/features/profile/application/use-cases/getUsersUseCase';
import { UserFilterParams } from '@/features/profile/domain/entities/models/user.types';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

export default withAuthorization({
  GET: ['Admin'],
})((req: NextApiRequest, res: NextApiResponse, userId: string) => {
  switch (req.method) {
    case 'GET':
      return GET(req, res, userId);
    default:
      return res
        .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
        .json(createResponse(RESPONSE_CODE.METHOD_NOT_ALLOWED, Messages.METHOD_NOT_ALLOWED));
  }
});

export async function GET(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const {
      search,
      role,
      status,
      fromDate,
      toDate,
      page = 1,
      pageSize = 10,
    } = req.query as UserFilterParams;

    // Import the use case at the top of the file:
    // import { GetUsersUseCase } from '@/features/profile/application/usecases/getUsersUseCase';

    // Initialize use case with repository

    // Execute use case
    const result = await getUsersUseCase.execute({
      search,
      role,
      status,
      fromDate,
      toDate,
      page: Number(page),
      pageSize: Number(pageSize),
    });

    return res.status(result.status).json(result);
  } catch (error) {
    console.error('User API Error:', error);
    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(createResponse(RESPONSE_CODE.INTERNAL_SERVER_ERROR, 'Failed to fetch users data'));
  }
}
