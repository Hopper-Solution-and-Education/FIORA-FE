'use client';

import { useSession } from 'next-auth/react';
import { LoadingProgress } from './LoadingProgress';

export default function SessionGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  if (status === 'loading') return <LoadingProgress />;
  // if (!session) {
  //   redirect('/auth/sign-in');
  // }

  return <>{children}</>;
}
