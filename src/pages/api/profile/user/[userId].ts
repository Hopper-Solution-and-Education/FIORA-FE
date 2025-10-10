import { profileUseCase } from '@/features/profile/application/use-cases/profileUseCase';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { UserRole } from '@/shared/constants/userRole';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import formidable from 'formidable';
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'node:fs/promises';

import { UserProfile } from '@/features/profile/domain/entities/models/profile';
import { profileRepository } from '@/features/profile/infrastructure/repositories/profileRepository';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';

export const maxDuration = 30; // 30 seconds

export const config = {
  api: {
    bodyParser: false,
  },
};

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

  const contentType = req.headers['content-type'] || '';
  const isMultipart = contentType.includes('multipart/form-data');

  if (isMultipart) {
    const form = formidable({ keepExtensions: true, maxFileSize: 5 * 1024 * 1024 });
    const [fields, files] = await form.parse(req);

    const toNodeFile = async (f: any): Promise<File | null> => {
      if (!f) return null;
      const one = Array.isArray(f) ? f[0] : f;
      if (!one) return null;
      const buffer = await fs.readFile(one.filepath);
      const name = one.originalFilename || 'upload';
      const type = one.mimetype || 'application/octet-stream';
      return new File([buffer as Uint8Array<ArrayBuffer>], name, { type });
    };

    const newAvatar = await toNodeFile(files.newAvatar);
    const newLogo = await toNodeFile(files.newLogo);

    const getField = (key: string): string | undefined => {
      const v = fields[key];
      if (!v) return undefined;
      return Array.isArray(v) ? (v[0] as string) : (v as string);
    };

    const updated = await profileUseCase.update(
      userId as string,
      {
        name: getField('name'),
        phone: getField('phone'),
        address: getField('address'),
        birthday: getField('birthday'),
        newAvatar: newAvatar || undefined,
        newLogo: newLogo || undefined,
      },
      sessionUserId,
    );
    return res
      .status(RESPONSE_CODE.OK)
      .json({ message: Messages.UPDATE_SUCCESS, data: updated, status: RESPONSE_CODE.OK });
  }

  // JSON fallback
  const body = req.body as Partial<UserProfile>;
  const updated = await profileUseCase.update(
    userId as string,
    {
      name: body.name,
      avatarUrl: body.avatarUrl,
      logoUrl: body.logoUrl,
      phone: body.phone,
      address: body.address,
      birthday: body.birthday,
    },
    sessionUserId,
  );

  return res
    .status(RESPONSE_CODE.OK)
    .json({ message: Messages.UPDATE_SUCCESS, data: updated, status: RESPONSE_CODE.OK });
}
