import { dashboardRepository } from '@/features/setting/api/infrastructure/repositories/dashboardRepository';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { Messages } from '@/shared/constants/message';
import { createErrorResponse } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { SessionUser } from '@/shared/types/session';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

export default sessionWrapper(
  (req: NextApiRequest, res: NextApiResponse, userId: string, user: SessionUser) =>
    errorHandler(
      async (request, response) => {
        switch (request.method) {
          case 'PATCH':
            return PATCH(request, response, userId);
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

export async function PATCH(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { id } = req.query;
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
  await dashboardRepository.changeCronjob(cronjob, userId);
  return res
    .status(RESPONSE_CODE.OK)
    .json(createResponse(RESPONSE_CODE.OK, Messages.UPDATE_SUCCESS));
}
