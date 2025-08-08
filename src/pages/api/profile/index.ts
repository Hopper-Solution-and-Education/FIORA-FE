import { profileUseCase } from '@/features/profile/application/use-cases/profileUseCase';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import type { NextApiRequest, NextApiResponse } from 'next';

type ProfileDTO = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  phone?: string | null;
  address?: string | null;
  birthday?: string | null;
};

const toDTO = (u: any): ProfileDTO => ({
  id: u.id,
  name: u.name ?? null,
  email: u.email,
  image: u.image ?? null,
});

const updateToDTO = (u: any): ProfileDTO => toDTO(u);

export default sessionWrapper((req: NextApiRequest, res: NextApiResponse, userId: string) =>
  errorHandler(
    async (request, response) => {
      switch (request.method) {
        case 'POST':
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
    return res.status(404).json({ message: 'Profile not found', data: null, status: 404 });
  }
  return res.status(RESPONSE_CODE.OK).json({ message: 'OK', data: toDTO(profile), status: 200 });
}

export async function PUT(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const body = req.body as Partial<ProfileDTO>;
  const updated = await profileUseCase.update(userId, {
    name: body.name,
    image: body.image,
    phone: body.phone,
    address: body.address,
    birthday: body.birthday,
  });
  return res.status(200).json({ message: 'Updated', data: updateToDTO(updated), status: 200 });
}
