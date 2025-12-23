import { eKycRepository } from '@/features/setting/api/infrastructure/repositories/eKycRepository';
import { Messages, UserRole } from '@/shared/constants';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { SessionUser } from '@/shared/types';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { OtpType } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export const maxDuration = 30;

const rolePermissions = {
  POST: [UserRole.ADMIN, UserRole.CS],
};

export default withAuthorization(rolePermissions)(
  (req: NextApiRequest, res: NextApiResponse, sessionUserId: string, user: SessionUser) =>
    errorHandler(
      async (request, response) => {
        switch (request.method) {
          case 'POST':
            return POST(request, response, user);
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

export async function POST(req: NextApiRequest, res: NextApiResponse, user: SessionUser) {
  await eKycRepository.sendOtp(user, OtpType.VERIFY_EKYC, '120');
  return res
    .status(RESPONSE_CODE.CREATED)
    .json(createResponse(RESPONSE_CODE.CREATED, Messages.SEND_SUCCESS));
}
