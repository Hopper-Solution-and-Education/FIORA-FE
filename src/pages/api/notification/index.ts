import { notificationUseCase } from '@/features/notification/application/use-cases/notificationUseCase';
import { Messages } from '@/shared/constants';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { errorHandler } from '@/shared/lib';
import { createError, createResponse } from '@/shared/lib/responseUtils/createResponse';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import type { NextApiRequest, NextApiResponse } from 'next';

export default withAuthorization({
  GET: ['Admin'],
  POST: ['Admin'],
})((req: NextApiRequest, res: NextApiResponse) =>
  errorHandler(
    async (request, response) => {
      switch (request.method) {
        case 'GET':
          return GET(request, response);
        case 'POST':
          return POST(request, response);
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

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { page = 1, pageSize = 20, search = '', ...filters } = req.query;
  const result = await notificationUseCase.getNotificationsPagination({
    page: Number(page),
    pageSize: Number(pageSize),
    filters,
    search: String(search),
  });
  return res
    .status(RESPONSE_CODE.OK)
    .json(createResponse(RESPONSE_CODE.OK, Messages.GET_NOTIFICATION_SUCCESS, result));
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const input = req.body;
  if (!input.title || !input.type || !input.message) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(
        createError(
          res,
          RESPONSE_CODE.BAD_REQUEST,
          'Missing required fields: title, type, or message',
        ),
      );
  }

  const notification = await notificationUseCase.createBoxNotification({
    title: input.title,
    type: input.type,
    notifyTo: input.notifyTo,
    attachmentId: input.attachmentId,
    deepLink: input.deepLink,
    message: input.message,
    emails: input.emails,
  });
  return res
    .status(RESPONSE_CODE.CREATED)
    .json(createResponse(RESPONSE_CODE.CREATED, 'Notification created successfully', notification));
}
