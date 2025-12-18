import { dashboardRepository } from '@/features/setting/api/infrastructure/repositories/dashboardRepository';
import { Messages } from '@/shared/constants';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createErrorResponse } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { SessionUser } from '@/shared/types';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

export default sessionWrapper(
  (req: NextApiRequest, res: NextApiResponse, userId: string, user: SessionUser) =>
    errorHandler(
      async (request, response) => {
        switch (request.method) {
          case 'PATCH':
            return PATCH(request, response, user);
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

export async function PATCH(req: NextApiRequest, res: NextApiResponse, user: SessionUser) {
  const { id } = req.query;
  const { tierId, reason } = req.body;

  if (!tierId) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, 'You must input tier id!'));
  }

  if (!id) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, 'You must input cronjob id!'));
  }
  const cronjob = await dashboardRepository.getCronjob(id as string);

  if (!cronjob) {
    return res
      .status(RESPONSE_CODE.NOT_FOUND)
      .json(createErrorResponse(RESPONSE_CODE.NOT_FOUND, 'Cron job not found!'));
  }

  if (!cronjob?.status) {
    return res
      .status(RESPONSE_CODE.CONFLICT)
      .json(createErrorResponse(RESPONSE_CODE.NOT_FOUND, 'Cronjob has been processed!'));
  }

  const tier = await dashboardRepository.getTier(tierId as string);
  if (!tier) {
    return res
      .status(RESPONSE_CODE.NOT_FOUND)
      .json(createErrorResponse(RESPONSE_CODE.NOT_FOUND, 'Membership tier not found!'));
  }

  const result = await dashboardRepository.changeCronjob(cronjob, user, tier, reason);
  if (result == 404) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createResponse(RESPONSE_CODE.BAD_REQUEST, Messages.UPDATE_FAIL));
  }
  return res
    .status(RESPONSE_CODE.OK)
    .json(createResponse(RESPONSE_CODE.OK, Messages.UPDATE_SUCCESS, result));
}
