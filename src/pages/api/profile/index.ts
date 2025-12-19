import { profileUseCase } from '@/features/profile/application/use-cases/profileUseCase';
import { Messages } from '@/shared/constants';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import type { NextApiRequest, NextApiResponse } from 'next';

type ProfileDTO = {
  id: string;
  name: string | null;
  email: string;
  avatarUrl?: string | null;
  logoUrl?: string | null;
  phone?: string | null;
  address?: string | null;
  birthday?: string | null;
};

export default sessionWrapper((req: NextApiRequest, res: NextApiResponse, userId: string) =>
  errorHandler(
    async (request, response) => {
      switch (request.method) {
        case 'PUT':
          return PUT(request, response, userId);
        case 'GET':
          return GET(request, response, userId);
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

export async function GET(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const profile = await profileUseCase.getById(userId);
  if (!profile) {
    return res
      .status(RESPONSE_CODE.NOT_FOUND)
      .json({ message: Messages.USER_NOT_FOUND, data: null, status: RESPONSE_CODE.NOT_FOUND });
  }
  return res
    .status(RESPONSE_CODE.OK)
    .json({ message: Messages.GET_SUCCESS, data: profile, status: RESPONSE_CODE.OK });
}

export async function PUT(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const body = req.body as Partial<ProfileDTO> & {
    avatarAttachmentId?: string;
    logoAttachmentId?: string;
    referrer_code?: string;
  };

  const updated = await profileUseCase.update(userId, {
    name: body.name,
    phone: body.phone,
    address: body.address,
    birthday: body.birthday,
    avatarAttachmentId: body.avatarAttachmentId,
    logoAttachmentId: body.logoAttachmentId,
    referrer_code: body.referrer_code,
  });

  return res
    .status(RESPONSE_CODE.OK)
    .json({ message: Messages.UPDATE_SUCCESS, data: updated, status: RESPONSE_CODE.OK });
}
