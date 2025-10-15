import { useSession } from 'next-auth/react';
import { UserRole } from '@prisma/client';

export function useUserSession() {
  const { data: session, status } = useSession();

  const currentUserRole = session?.user?.role as UserRole | undefined;
  const isAdmin = currentUserRole === UserRole.Admin;
  const isCS = currentUserRole === UserRole.CS;

  return {
    session,
    status,
    currentUserRole,
    isAdmin,
    isCS,
  };
}