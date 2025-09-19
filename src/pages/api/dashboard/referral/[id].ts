import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { Messages } from '@/shared/constants/message';
import { createErrorResponse } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { SessionUser } from '@/shared/types/session';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { NextApiRequest, NextApiResponse } from 'next';
import { mockReferralDataStore } from '../mockReferralDataStore';

export default sessionWrapper(
  (req: NextApiRequest, res: NextApiResponse, userId: string, user: SessionUser) =>
    errorHandler(
      async (request, response) => {
        switch (request.method) {
          case 'PATCH':
            return PATCH(request, response, userId, user);
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

export async function PATCH(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string,
  user: SessionUser,
) {
  const { id } = req.query;
  const { amount, reason } = req.body;

  if (!id) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, 'Referral ID is required!'));
  }

  if (!amount || !reason) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, 'Amount and reason are required!'));
  }

  try {
    // Update the referral in mock data store
    const updateSuccess = mockReferralDataStore.updateReferral(id as string, {
      status: 'successful',
      amount: amount,
      reason: reason,
      updatedBy: {
        id: userId,
        email: user.email || 'Admin',
      },
    });

    if (!updateSuccess) {
      return res
        .status(RESPONSE_CODE.NOT_FOUND)
        .json(createErrorResponse(RESPONSE_CODE.NOT_FOUND, 'Referral not found!'));
    }

    console.log('Retrying referral:', {
      id,
      amount,
      reason,
      userId,
    });

    // Get updated data
    const updatedReferral = mockReferralDataStore.getData().find((item) => item.id === id);

    const retryResult = {
      id: id as string,
      status: 'successful',
      amount: parseFloat(amount),
      reason,
      updatedBy: userId,
      updatedAt: new Date().toISOString(),
      updatedReferral, // Include the full updated referral data
    };

    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, 'Referral retry successful', retryResult));
  } catch (error: any) {
    console.error('Error retrying referral:', error);
    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(createErrorResponse(RESPONSE_CODE.INTERNAL_SERVER_ERROR, 'Failed to retry referral'));
  }
}
