import { notificationUseCase } from '@/features/notification/application/use-cases/notificationUseCase';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { errorHandler } from '@/shared/lib';
import { createError, createResponse } from '@/shared/lib/responseUtils/createResponse';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { NotificationType } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

export default withAuthorization({
  POST: ['Admin', 'User', 'CS'],
})((req: NextApiRequest, res: NextApiResponse) =>
  errorHandler(
    async (request, response) => {
      switch (request.method) {
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

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const {
    title,
    type,
    notifyTo,
    attachmentId,
    deepLink,
    message,
    emails,
    emailTemplateId,
    emailParts,
    subject,
  } = req.body;

  // Validate required fields
  if (!title) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createError(res, RESPONSE_CODE.BAD_REQUEST, 'Missing required field: title'));
  }

  if (!type) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createError(res, RESPONSE_CODE.BAD_REQUEST, 'Missing required field: type'));
  }

  if (!notifyTo) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createError(res, RESPONSE_CODE.BAD_REQUEST, 'Missing required field: notifyTo'));
  }

  if (!message) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createError(res, RESPONSE_CODE.BAD_REQUEST, 'Missing required field: message'));
  }

  if (!emailTemplateId) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createError(res, RESPONSE_CODE.BAD_REQUEST, 'Missing required field: emailTemplateId'));
  }

  if (!emailParts || !Array.isArray(emailParts) || emailParts.length === 0) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(
        createError(
          res,
          RESPONSE_CODE.BAD_REQUEST,
          'Missing or invalid field: emailParts (must be a non-empty array)',
        ),
      );
  }

  // Validate notifyTo enum
  const validNotifyToValues = Object.values(NotificationType);
  if (!validNotifyToValues.includes(notifyTo)) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(
        createError(
          res,
          RESPONSE_CODE.BAD_REQUEST,
          `Invalid notifyTo value. Must be one of: ${validNotifyToValues.join(', ')}`,
        ),
      );
  }

  // Validate emailParts structure
  for (let i = 0; i < emailParts.length; i++) {
    const part = emailParts[i];
    if (!part.user_id || !part.recipient) {
      return res
        .status(RESPONSE_CODE.BAD_REQUEST)
        .json(
          createError(
            res,
            RESPONSE_CODE.BAD_REQUEST,
            `Invalid emailPart at index ${i}: missing user_id or recipient`,
          ),
        );
    }
  }

  try {
    const result = await notificationUseCase.createNotificationWithTemplate({
      title,
      type,
      notifyTo,
      attachmentId,
      deepLink,
      message,
      emails,
      emailTemplateId,
      emailParts,
      subject,
    });

    return res.status(RESPONSE_CODE.CREATED).json(
      createResponse(
        RESPONSE_CODE.CREATED,
        `Notification created and sent successfully. ${result.emailResult.successCount} emails sent, ${result.emailResult.failedCount} failed`,
        {
          notification: result.notification,
          emailResult: result.emailResult,
        },
      ),
    );
  } catch (error) {
    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(
        createError(
          res,
          RESPONSE_CODE.INTERNAL_SERVER_ERROR,
          'Failed to create notification with template',
        ),
      );
  }
}
