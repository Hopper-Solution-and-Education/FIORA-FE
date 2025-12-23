import { notificationUseCase } from '@/features/notification/application/use-cases/notificationUseCase';
import { CreateBoxNotificationInput } from '@/features/notification/domain/repositories/notificationRepository.interface';
import { Messages } from '@/shared/constants';
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
  const { email, username, tier_name, user_id } = req.body;

  try {
    const date = new Date();
    const data: CreateBoxNotificationInput = {
      title: 'FIORA Membership Tier Change Notification',
      type: 'MEMBERSHIP',
      notifyTo: 'ROLE_USER',
      attachmentId: '',
      deepLink: '',
      message: 'Your FIORA Membership Tier Has Changed!',
      emails: [email],
    };
    const result = await notificationUseCase.createNotificationCronjob(
      data,
      email,
      username,
      tier_name,
      date.toString(),
      user_id,
    );
    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, `Notification sent successfully.`, result));
  } catch (error) {
    console.error('Error sending notification:', error);

    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(createError(res, RESPONSE_CODE.INTERNAL_SERVER_ERROR, 'Failed to send notification'));
  }
}
