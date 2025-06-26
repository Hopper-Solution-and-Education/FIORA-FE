import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { type NextApiRequest, type NextApiResponse } from 'next';
import { UserRole } from '@prisma/client';

export async function getSessionUser(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  return session?.user as {
    id: string;
    role?: UserRole | null;
    name?: string | null;
    email?: string | null;
  } | null;
}

export function isAdminOrCS(role?: UserRole | null): boolean {
  return role === UserRole.Admin || role === UserRole.CS;
}
