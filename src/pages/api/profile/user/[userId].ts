import { profileUseCase } from '@/features/profile/application/use-cases/profileUseCase';
import { UserProfile } from '@/features/profile/domain/entities/models/profile';
import { profileRepository } from '@/features/profile/infrastructure/repositories/profileRepository';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { UserRole } from '@/shared/constants/userRole';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import type { NextApiRequest, NextApiResponse } from 'next';

export const maxDuration = 30; // 30 seconds

const rolePermissions = {
  GET: [UserRole.ADMIN, UserRole.CS],
  PUT: [UserRole.ADMIN],
};

export default withAuthorization(rolePermissions)(
  (req: NextApiRequest, res: NextApiResponse, sessionUserId: string) =>
    errorHandler(
      async (request, response) => {
        switch (request.method) {
          case 'GET':
            return GET(request, response);
          case 'PUT':
            return PUT(request, response, sessionUserId);
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

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  if (!userId || typeof userId !== 'string') {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createResponse(RESPONSE_CODE.BAD_REQUEST, 'User ID is required', null));
  }

  const profile = await profileRepository.getById(userId);

  if (!profile) {
    return res
      .status(RESPONSE_CODE.NOT_FOUND)
      .json(createResponse(RESPONSE_CODE.NOT_FOUND, Messages.USER_NOT_FOUND, null));
  }

  return res
    .status(RESPONSE_CODE.OK)
    .json(createResponse(RESPONSE_CODE.OK, 'Get profile successfully', profile));
}

export async function PUT(req: NextApiRequest, res: NextApiResponse, sessionUserId: string) {
  const { userId } = req.query;

  if (!userId || typeof userId !== 'string') {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createResponse(RESPONSE_CODE.BAD_REQUEST, 'User ID is required', null));
  }

  const body = req.body as Partial<UserProfile> & {
    avatarAttachmentId?: string;
    logoAttachmentId?: string;
  };

  const updated = await profileUseCase.update(
    userId as string,
    {
      name: body.name,
      phone: body.phone,
      address: body.address,
      birthday: body.birthday,
      avatarAttachmentId: body.avatarAttachmentId,
      logoAttachmentId: body.logoAttachmentId,
    },
    sessionUserId,
  );

  return res
    .status(RESPONSE_CODE.OK)
    .json({ message: Messages.UPDATE_SUCCESS, data: updated, status: RESPONSE_CODE.OK });
}
