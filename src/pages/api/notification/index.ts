import NotificationUseCase from '@/features/notification/application/use-cases/notificationUseCase';
import { notificationRepository } from '@/features/notification/infrastructure/repositories/notificationRepository';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createError, createResponse } from '@/shared/lib/responseUtils/createResponse';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import type { NextApiRequest, NextApiResponse } from 'next';

const notificationUseCase = new NotificationUseCase(notificationRepository);

export default withAuthorization({
  GET: ['Admin'],
  POST: ['Admin'],
})(async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      return GET(req, res);
    case 'POST':
      return POST(req, res);
    default:
      return res
        .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
        .json({ error: Messages.METHOD_NOT_ALLOWED });
  }
});

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
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

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
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
      attachmentId: input.attachmentId,
      deepLink: input.deepLink,
      message: input.message,
      emails: input.emails,
    });
    return res
      .status(RESPONSE_CODE.CREATED)
      .json(
        createResponse(RESPONSE_CODE.CREATED, 'Notification created successfully', notification),
      );
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
