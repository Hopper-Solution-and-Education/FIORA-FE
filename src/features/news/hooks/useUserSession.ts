import { USER_ROLES } from '@/shared/constants/featuresFlags';
import { Session, useSession } from 'next-auth/react';

export const useUserSession = () => {
  const { data: session } = useSession() as { data: Session | null };
  const isAdmin = session?.user?.role.toUpperCase() === USER_ROLES.ADMIN;

  return {
    session,
    isAdmin,
  };
};
