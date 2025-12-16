import { USER_ROLES } from '@/shared/constants';
import { Session, useSession } from 'next-auth/react';

export const useUserSession = () => {
  const { data: session } = useSession() as { data: Session | null };
  const isAdminOrCs =
    session?.user?.role.toUpperCase() === USER_ROLES.ADMIN ||
    session?.user?.role.toUpperCase() === USER_ROLES.CS;

  return {
    session,
    isAdminOrCs,
  };
};
