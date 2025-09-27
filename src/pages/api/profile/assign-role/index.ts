import { userUseCase } from '@/features/profile/application/use-cases/userUsecase';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createErrorResponse } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { validateBody } from '@/shared/utils/validate';
import { validateAssignUserId } from '@/shared/validators/accountValidator';
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
  const { assignUserId } = req.body;

  //validationvalidation
  const error = validateBody(validateAssignUserId, { assignUserId: assignUserId });
  if (error.error) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, error.error));
  }
  const assignUser: string = assignUserId as string;
  //check user exist
  const userexist = await userUseCase.getUserIdById(assignUser);

  if (!userexist || userexist == null) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.USER_NOT_FOUND, {}));
  }

  //block user
  const blockededUser = await userUseCase.blockUser(assignUser, userId);

  if (!assignUser || assignUser == null) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createResponse(RESPONSE_CODE.BAD_REQUEST, Messages.ASSIGN_USER_FAILED, {}));
  }

  return res
    .status(RESPONSE_CODE.CREATED)
    .json(createResponse(RESPONSE_CODE.CREATED, Messages.ASSIGN_USER_SUCCESS, assignUser));
}
