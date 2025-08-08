import { profileUseCase } from '@/features/profile/application/use-cases/profileUseCase';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({ message: 'Unauthorized', data: null, status: 401 });
  }

  const user = await profileUseCase.getByEmail(session.user.email);
  if (!user) {
    return res.status(404).json({ message: 'User not found', data: null, status: 404 });
  }

  if (req.method === 'GET') {
    const profile = await profileUseCase.getById(user.id);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found', data: null, status: 404 });
    }
    return res.status(200).json({ message: 'OK', data: toDTO(profile), status: 200 });
  }

  if (req.method === 'PUT') {
    const body = req.body as Partial<ProfileDTO>;
    const updated = await profileUseCase.update(user.id, {
      name: body.name,
      image: body.image,
      phone: body.phone,
      address: body.address,
      birthday: body.birthday,
    });
    return res.status(200).json({ message: 'Updated', data: updateToDTO(updated), status: 200 });
  }

  res.setHeader('Allow', ['GET', 'PUT']);
  return res.status(405).json({ message: 'Method Not Allowed', data: null, status: 405 });
}
