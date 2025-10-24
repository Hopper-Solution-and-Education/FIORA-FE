import { prisma } from '@/config';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createErrorResponse } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import type { NextApiRequest, NextApiResponse } from 'next';

type VerifyReferralCodeRequest = {
  referralCode: string;
};

export default sessionWrapper((req: NextApiRequest, res: NextApiResponse, userId: string) =>
  errorHandler(
    async (request, response) => {
      if (request.method !== 'POST') {
        return response
          .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
          .json({ error: Messages.METHOD_NOT_ALLOWED });
      }

      return POST(request, response, userId);
    },
    req,
    res,
  ),
);

export async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { referralCode } = req.body as VerifyReferralCodeRequest;

  // Validation
  if (!referralCode || referralCode.trim().length === 0) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, 'Referral code is required'));
  }

  // Trim and validate length
  const trimmedCode = referralCode.trim();
  if (trimmedCode.length < 3 || trimmedCode.length > 15) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(
        createErrorResponse(
          RESPONSE_CODE.BAD_REQUEST,
          'Referral code must be between 3 and 15 characters',
        ),
      );
  }

  // Check if referral code exists
  const referrer = await prisma.user.findUnique({
    where: { referral_code: trimmedCode },
    select: {
      id: true,
      name: true,
      referral_code: true,
    },
  });

  if (!referrer) {
    return res
      .status(RESPONSE_CODE.NOT_FOUND)
      .json(createErrorResponse(RESPONSE_CODE.NOT_FOUND, 'Referral code not found'));
  }

  // Check if user is trying to use their own referral code
  if (referrer.id === userId) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, 'Cannot use your own referral code'));
  }

  return res.status(RESPONSE_CODE.OK).json(
    createResponse(RESPONSE_CODE.OK, 'Referral code is valid', {
      referrerName: referrer.name,
    }),
  );
}
