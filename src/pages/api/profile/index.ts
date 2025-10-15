import { profileUseCase } from '@/features/profile/application/use-cases/profileUseCase';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import formidable from 'formidable';
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'node:fs/promises';

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

export const config = {
  api: {
    bodyParser: false,
  },
};

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

    const updated = await profileUseCase.update(userId, {
      name: getField('name'),
      phone: getField('phone'),
      address: getField('address'),
      birthday: getField('birthday'),
      newAvatar: newAvatar || undefined,
      newLogo: newLogo || undefined,
      referrer_code: getField('referrer_code'),
    });

    return res
      .status(RESPONSE_CODE.OK)
      .json({ message: Messages.UPDATE_SUCCESS, data: updated, status: RESPONSE_CODE.OK });
  }

  // JSON fallback
  const body = req.body as Partial<ProfileDTO>;
  const updated = await profileUseCase.update(userId, {
    name: body.name,
    avatarUrl: body.avatarUrl,
    logoUrl: body.logoUrl,
    phone: body.phone,
    address: body.address,
    birthday: body.birthday,
  });
  return res
    .status(RESPONSE_CODE.OK)
    .json({ message: Messages.UPDATE_SUCCESS, data: updated, status: RESPONSE_CODE.OK });
}
