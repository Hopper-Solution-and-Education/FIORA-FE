import { userUseCase } from '@/features/profile/application/use-cases/userUsecase';
import { Messages } from '@/shared/constants';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createErrorResponse } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { validateVariable } from '@/shared/utils/validate';
import { ValidatedUserId } from '@/shared/validators/accountValidator';
import { NextApiRequest, NextApiResponse } from 'next';

export default withAuthorization({
  GET: ['Admin'],
})((req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      return GET(req, res);
    default:
      return res
        .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
        .json(createResponse(RESPONSE_CODE.METHOD_NOT_ALLOWED, Messages.METHOD_NOT_ALLOWED));
  }
});

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  //validationvalidation
  const userValidated = userId as string;
  const error = validateVariable(ValidatedUserId, userValidated);
  if (error.error) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, error.error));
  }

  const myProfile = await userUseCase.getMyProfile(userValidated);

  if (!myProfile) {
    return res
      .status(RESPONSE_CODE.NOT_FOUND)
      .json(createResponse(RESPONSE_CODE.NOT_FOUND, Messages.USER_NOT_FOUND, null));
  }

  return res
    .status(RESPONSE_CODE.OK)
    .json(createResponse(RESPONSE_CODE.OK, Messages.GET_SUCCESS, myProfile));
}
