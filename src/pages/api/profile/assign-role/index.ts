import { userUseCase } from '@/features/profile/application/use-cases/userUsecase';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createErrorResponse } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { validateBody } from '@/shared/utils/validate';
import { validateAssignRequest } from '@/shared/validators/accountValidator';
import { UserRole } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default withAuthorization({
  PUT: ['Admin'],
})((req: NextApiRequest, res: NextApiResponse, userId: string) => {
  switch (req.method) {
    case 'PUT':
      return PUT(req, res, userId);
  }
});

export async function PUT(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { assignUserId, role } = req.body;

  //validationvalidation
  const error = validateBody(validateAssignRequest, { assignUserId: assignUserId, role: role });
  if (error.error) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, error.error));
  }

  //check user self assign role
  if (userId === assignUserId) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.USER_SELF_ASSIGN_ROLE));
  }

  const user: string = assignUserId as string;
  const roleAssign: UserRole = role as UserRole;
  //check user exist
  const userexist = await userUseCase.getUserIdById(user);

  if (!userexist || userexist == null) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.USER_NOT_FOUND, {}));
  }

  //block user
  const assignUserResult = await userUseCase.assignRole(user, roleAssign, userId);

  if (!assignUserResult || assignUserResult == null) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createResponse(RESPONSE_CODE.BAD_REQUEST, Messages.ASSIGN_ROLE_FAILED, {}));
  }

  return res
    .status(RESPONSE_CODE.CREATED)
    .json(createResponse(RESPONSE_CODE.CREATED, Messages.ASSIGN_ROLE_SUCCESS, assignUserResult));
}
