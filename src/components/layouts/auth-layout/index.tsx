// app/components/auth-layout.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import Loading from '@/components/common/loading';

interface AuthLayoutProps {
  children: ReactNode;
  requiresAuth?: boolean;
}

export default function AuthLayout({ children, requiresAuth = false }: AuthLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Handle loading state
    if (status === 'loading') return;

    // Check session expiration
    const isSessionExpired = session?.expiredTime
      ? Math.floor(Date.now() / 1000) > session.expiredTime
      : false;

    if (requiresAuth) {
      // For protected routes
      if (!session || isSessionExpired) {
        // Redirect to sign-in page with callback URL
        if (pathname) {
          router.push(`/auth/sign-in?callbackUrl=${encodeURIComponent(pathname)}`);
        } else {
          router.push('/auth/sign-in');
        }
      }
    } else {
      // For public routes that shouldn't be accessed when authenticated
      if (session && !isSessionExpired && pathname === '/auth/sign-in') {
        router.push('/');
      }
    }
  }, [session, status, pathname, requiresAuth, router]);

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-svh">
        <Loading />
      </div>
    );
  }

  // For protected routes, only render children if authenticated and session is valid
  if (
    requiresAuth &&
    (!session || (session.expiredTime && Math.floor(Date.now() / 1000) > session.expiredTime))
  ) {
    return null;
  }

  return <>{children}</>;
}
