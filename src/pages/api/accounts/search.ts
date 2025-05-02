import { createError, createResponse } from '@/shared/lib/responseUtils/createResponse';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { NextApiRequest, NextApiResponse } from 'next';
import { AccountUseCaseInstance } from '@/features/auth/application/use-cases/accountUseCase';

export default withAuthorization({
  POST: ['User', 'Admin', 'CS'],
  GET: ['User', 'Admin', 'CS'],
})(async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
  switch (req.method) {
    case 'POST':
      return POST(req, res, userId);

    default:
      return res
        .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
        .json({ error: 'Phương thức không được hỗ trợ' });
  }
});

export async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const account = await AccountUseCaseInstance.filterAccountOptions(req.body, userId);

    if (!account) {
      return res
        .status(RESPONSE_CODE.OK)
        .json(createResponse(RESPONSE_CODE.OK, Messages.GET_ACCOUNT_FILTERED_SUCCESS, []));
    }

    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, Messages.GET_ACCOUNT_FILTERED_SUCCESS, account));
  } catch (error: any) {
    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(
        createError(
          res,
          RESPONSE_CODE.INTERNAL_SERVER_ERROR,
          error.message || Messages.INTERNAL_ERROR,
        ),
      );
  }
}
