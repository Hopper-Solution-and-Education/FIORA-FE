// app/components/auth-layout.tsx
'use client';

import Loading from '@/components/common/atoms/Loading';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  requiresAuth?: boolean;
}

export default function AuthLayout({ children, requiresAuth = false }: AuthLayoutProps) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Handle loading state
    if (status === 'loading') return;

    if (requiresAuth) {
      // For protected routes
      if (status === 'unauthenticated') {
        // Redirect to sign-in page with callback URL
        if (pathname) {
          router.push(`/auth/sign-in?callbackUrl=${encodeURIComponent(pathname)}`);
        } else {
          router.push('/auth/sign-in');
        }
      }
    } else {
      // For public routes that shouldn't be accessed when authenticated
      if (status === 'unauthenticated' && pathname === '/auth/sign-in') {
        router.push('/');
      }
    }
  }, [status, pathname, requiresAuth, router]);

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-svh">
        <Loading />
      </div>
    );
  }

  // For protected routes, only render children if authenticated and session is valid
  if (requiresAuth && status === 'unauthenticated') {
    return null;
  }

  return <>{children}</>;
}
