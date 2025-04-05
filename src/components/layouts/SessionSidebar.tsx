'use client';

import AppSidebar from '@/components/layouts/AppSidebar';
import { navItems as HomeNavItems } from '@/features/home/constants/data';
import { Session, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setModule } from '@/store/slices/moduleSlice';
import { MODULE } from '@/shared/constants';

export default function SessionSidebar() {
  const { data: session } = useSession() as { data: Session | null };
  const dispatch = useDispatch();

  useEffect(() => {
    if (session?.user) {
      // Set initial module based on user role
      const currentModule = session.user.role === 'Admin' ? MODULE.ADMIN : MODULE.HOME;
      dispatch(setModule(currentModule));
    }
  }, [session?.user?.role, dispatch]);

  if (!session?.user) {
    return null;
  }

  return <AppSidebar appLabel="Overview" navItems={HomeNavItems} />;
}
