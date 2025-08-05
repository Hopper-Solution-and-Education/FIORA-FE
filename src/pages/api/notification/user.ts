import { notificationRepository } from '@/features/notification/infrastructure/repositories/notificationRepository';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { errorHandler } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
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
  const { unread } = req.query;
  if (unread === 'true') {
    const notifications = await notificationRepository.getUserNotificationsUnread(userId, 20);
    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, 'Get unread notifications success', notifications));
  } else {
    const notifications = await notificationRepository.getUserNotifications(userId);
    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, 'Get notifications success', notifications));
  }
}
