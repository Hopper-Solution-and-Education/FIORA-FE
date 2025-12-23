import { dashboardRepository } from '@/features/setting/api/infrastructure/repositories/dashboardRepository';
import { Messages } from '@/shared/constants';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

export default withAuthorization({
  PUT: ['Admin'],
})((req: NextApiRequest, res: NextApiResponse, userId: string) =>
  errorHandler(
    async (request, response) => {
      switch (request.method) {
        case 'PUT':
          return PUT(request, response, userId);
        default:
          return response
            .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
            .json({ error: Messages.METHOD_NOT_ALLOWED });
      }
    },
    req,
    res,
  ),
);

export async function PUT(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { id } = req.query;
  const { amount, reason } = req.body;

  if (!id) {
    return res.status(RESPONSE_CODE.BAD_REQUEST).json({
      status: RESPONSE_CODE.BAD_REQUEST,
      message: Messages.MISSING_PARAMS_INPUT + ' id',
    });
  }

  if (!amount || !reason) {
    return res.status(RESPONSE_CODE.BAD_REQUEST).json({
      status: RESPONSE_CODE.BAD_REQUEST,
      message: Messages.MISSING_PARAMS_INPUT + ' amount and reason',
    });
  }

  const result = await dashboardRepository.updateCronjobReferral(
    id as string,
    amount,
    reason,
    userId,
  );

  return res.status(RESPONSE_CODE.CREATED).json({
    status: RESPONSE_CODE.CREATED,
    message: Messages.UPDATE_REFERRAL_CRONJOB_SUCCESS,
    data: result,
  });
}
