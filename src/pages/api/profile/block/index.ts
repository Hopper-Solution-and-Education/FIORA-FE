import { userUseCase } from '@/features/profile/application/use-cases/userUsecase';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createErrorResponse } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { validateBody } from '@/shared/utils/validate';
import { validateBlockUserId } from '@/shared/validators/accountValidator';
import { NextApiRequest, NextApiResponse } from 'next';

export default withAuthorization({
  PUT: ['Admin'],
})((req: NextApiRequest, res: NextApiResponse, userId: string) => {
  switch (req.method) {
    case 'PUT':
      return PUT(req, res, userId);
    default:
      return res
        .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
        .json(
          createErrorResponse(RESPONSE_CODE.METHOD_NOT_ALLOWED, Messages.METHOD_NOT_ALLOWED, {}),
        );
  }
});

export async function PUT(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { blockUserId } = req.body;
  const blockUser: string = blockUserId as string;

  //validationvalidation
  const error = validateBody(validateBlockUserId, { blockUserId: blockUser });
  if (error.error) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, error.error));
  }

  if (userId === blockUser) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.CANNOT_BLOCK_YOURSELF));
  }

  //check user exist
  const userexist = await userUseCase.getUserIdById(blockUser);

  if (!userexist || userexist == null) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.USER_NOT_FOUND, {}));
  }

  //block user
  const blockededUser = await userUseCase.blockUser(blockUser, userId);

  if (!blockededUser || blockededUser == null) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createResponse(RESPONSE_CODE.BAD_REQUEST, Messages.BLOCK_USER_FAILED, {}));
  }

  return res
    .status(RESPONSE_CODE.CREATED)
    .json(createResponse(RESPONSE_CODE.CREATED, Messages.BLOCK_USER_SUCCESS, blockededUser));
}
