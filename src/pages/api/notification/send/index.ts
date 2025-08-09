import { notificationUseCase } from '@/features/notification/application/use-cases/notificationUseCase';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { errorHandler } from '@/shared/lib';
import { createError, createResponse } from '@/shared/lib/responseUtils/createResponse';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { NotificationType } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

export default withAuthorization({
  POST: ['Admin', 'User'],
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
  const { emailTemplateId, emailParts, notifyTo, type, subject } = req.body;

  // Validate required fields
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

  if (!notifyTo) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createError(res, RESPONSE_CODE.BAD_REQUEST, 'Missing required field: notifyTo'));
  }

  if (!type) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createError(res, RESPONSE_CODE.BAD_REQUEST, 'Missing required field: type'));
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

  try {
    const result = await notificationUseCase.sendNotificationWithTemplate(
      emailTemplateId,
      emailParts,
      notifyTo,
      type,
      subject,
    );

    return res
      .status(RESPONSE_CODE.OK)
      .json(
        createResponse(
          RESPONSE_CODE.OK,
          `Notification sent successfully. ${result.successCount} emails sent, ${result.failedCount} failed`,
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
