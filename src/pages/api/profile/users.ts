import { userUseCase } from '@/features/profile/application/use-cases/userUsecase';
import { UserFilterParams } from '@/features/profile/domain/entities/models/user.types';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createErrorResponse } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { User, UserRole } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default withAuthorization({
  GET: ['Admin', 'CS'],
})((req: NextApiRequest, res: NextApiResponse, userId: string, user: User) => {
  switch (req.method) {
    case 'GET':
      return GET(req, res, userId, user);
    default:
      return res
        .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
        .json(createResponse(RESPONSE_CODE.METHOD_NOT_ALLOWED, Messages.METHOD_NOT_ALLOWED));
  }
});

export async function GET(req: NextApiRequest, res: NextApiResponse, userId: string, user: User) {
  try {
    const {
      search,
      role: roleFilter, // Role filter từ query params
      status,
      fromDate,
      toDate,
      userFromDate,
      userToDate,
      page = 1,
      email,
      pageSize = 10,
    } = req.query as UserFilterParams;

    // Import the use case at the top of the file:
    // import { GetUsersUseCase } from '@/features/profile/application/usecases/getUsersUseCase';

    // Initialize use case with repository

    // Execute use case

    let result;
    const currentUserRole: UserRole = user.role as UserRole; // Role của user đang login
    if (user.role === UserRole.CS) {
      result = await userUseCase.getAllUserEkycPendingCS(
        {
          search,
          role: roleFilter, // Truyền role từ query để filter
          status,
          fromDate,
          toDate,
          email,
          userFromDate,
          userToDate,
          page: Number(page),
          pageSize: Number(pageSize),
        },
        currentUserRole,
      ); // Truyền role của user để check permission
    } else {
      result = await userUseCase.getAllUserEkycPending(
        {
          search,
          role: roleFilter, // Truyền role từ query để filter
          status,
          fromDate,
          email,
          toDate,
          userFromDate,
          userToDate,
          page: Number(page),
          pageSize: Number(pageSize),
        },
        currentUserRole,
      ); // Truyền role của user để check permission
    }

    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, Messages.GET_SUCCESS, result));
  } catch (error) {
    console.error('Get list user error:', error);
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.INTERNAL_SERVER_ERROR, Messages.GET_LIST_USER_ERROR));
  }
}
