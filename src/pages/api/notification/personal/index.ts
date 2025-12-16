import { notificationUseCase } from '@/features/notification/application/use-cases/notificationUseCase';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { errorHandler } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { ChannelType } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

export default withAuthorization({
  GET: ['Admin', 'CS', 'User'],
})((req: NextApiRequest, res: NextApiResponse, userId: string) =>
  errorHandler(
    async (request, response) => {
      switch (request.method) {
        case 'GET':
          return GET(request, response, userId);
        default:
          return response
            .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
            .json({ error: 'Method is not allowed' });
      }
    },
    req,
    res,
  ),
);

export async function GET(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { page = 1, pageSize = 20, search = '', ...filters } = req.query;
  const result = await notificationUseCase.getNotificationsPaginationByUser({
    page: Number(page),
    pageSize: Number(pageSize),
    filters: {
      ...filters,
      channel: [ChannelType.BOX],
    },
    search: String(search),
    userId,
  });
  return res
    .status(RESPONSE_CODE.OK)
    .json(createResponse(RESPONSE_CODE.OK, Messages.GET_NOTIFICATION_SUCCESS, result));
}
