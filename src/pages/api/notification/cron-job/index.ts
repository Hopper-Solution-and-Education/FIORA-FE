import { notificationUseCase } from '@/features/notification/application/use-cases/notificationUseCase';
import { CreateBoxNotificationInput } from '@/features/notification/domain/repositories/notificationRepository.interface';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createError, createResponse } from '@/shared/lib/responseUtils/createResponse';
import { apiKeyWrapper } from '@/shared/utils/apiKeyAuth';
import type { NextApiRequest, NextApiResponse } from 'next';

export default apiKeyWrapper(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    switch (req.method) {
      case 'POST':
        return POST(req, res);
      default:
        return createError(res, RESPONSE_CODE.METHOD_NOT_ALLOWED, Messages.METHOD_NOT_ALLOWED);
    }
  } catch (error: any) {
    return createError(
      res,
      RESPONSE_CODE.INTERNAL_SERVER_ERROR,
      error.message || Messages.INTERNAL_ERROR,
    );
  }
});

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.body;

  try {
    const data: CreateBoxNotificationInput = {
      title: 'FIORA Membership Tier Change Notification',
      type: 'MEMBERSHIP',
      notifyTo: 'ROLE_USER',
      attachmentId: '',
      deepLink: '',
      message: 'Your FIORA Membership Tier Has Changed!',
      emails: email,
    };
    const result = await notificationUseCase.createBoxNotification(data);
    return res
      .status(RESPONSE_CODE.OK)
      .json(
        createResponse(
          RESPONSE_CODE.OK,
          `Notification sent successfully. ${'result.successCount'} emails sent, ${'result.failedCount'} failed`,
          result,
        ),
      );
  } catch (error) {
    console.error('Error sending notification:', error);

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('Email template')) {
        return res
          .status(RESPONSE_CODE.NOT_FOUND)
          .json(createError(res, RESPONSE_CODE.NOT_FOUND, error.message));
      }

      if (error.message.includes('Email parts cannot be empty')) {
        return res
          .status(RESPONSE_CODE.BAD_REQUEST)
          .json(createError(res, RESPONSE_CODE.BAD_REQUEST, error.message));
      }
    }

    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(createError(res, RESPONSE_CODE.INTERNAL_SERVER_ERROR, 'Failed to send notification'));
  }
}
