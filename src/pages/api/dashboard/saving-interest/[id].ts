import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createErrorResponse } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { SessionUser } from '@/shared/types/session';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { NextApiRequest, NextApiResponse } from 'next';
import { mockSavingInterestDataStore } from '../mockSavingInterestDataStore';

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
              .json(createErrorResponse(RESPONSE_CODE.METHOD_NOT_ALLOWED, 'Method not allowed'));
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
  const { savingInterestAmount, reason } = req.body;

  if (!id) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, 'Saving Interest ID is required!'));
  }

  if (!savingInterestAmount || !reason) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(
        createErrorResponse(
          RESPONSE_CODE.BAD_REQUEST,
          'Saving Interest Amount and reason are required!',
        ),
      );
  }

  try {
    // Update the saving interest in mock data store
    const updateSuccess = mockSavingInterestDataStore.updateSavingInterest(id as string, {
      status: 'successful',
      savingInterestAmount: savingInterestAmount,
      reason: reason,
      updatedBy: {
        id: userId,
        email: user.email || 'Admin',
      },
    });

    if (!updateSuccess) {
      return res
        .status(RESPONSE_CODE.NOT_FOUND)
        .json(createErrorResponse(RESPONSE_CODE.NOT_FOUND, 'Saving Interest not found!'));
    }

    console.log('Retrying saving interest:', {
      id,
      savingInterestAmount,
      reason,
      userId,
    });

    // Get updated data
    const updatedSavingInterest = mockSavingInterestDataStore
      .getData()
      .find((item) => item.id === id);
    console.log('Updated saving interest data:', updatedSavingInterest);

    const retryResult = {
      id: id as string,
      status: 'successful',
      savingInterestAmount: parseFloat(savingInterestAmount),
      reason,
      updatedBy: userId,
      updatedAt: new Date().toISOString(),
      updatedSavingInterest, // Include the full updated saving interest data
    };

    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, 'Saving Interest retry successful', retryResult));
  } catch (error: any) {
    console.error('Error retrying saving interest:', error);
    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(
        createErrorResponse(RESPONSE_CODE.INTERNAL_SERVER_ERROR, 'Failed to retry saving interest'),
      );
  }
}
