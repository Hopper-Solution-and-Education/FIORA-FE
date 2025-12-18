'use client';

import { authService } from '@/features/auth/services/auth.service';
import { useMutation } from '@tanstack/react-query';
import { signOut } from 'next-auth/react';
import { toast } from 'sonner';

export function useLogout() {
  const { mutate: logout, ...props } = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: async () => {
      // TODO: Remove logic when completed migration
      await signOut({ callbackUrl: '/auth/sign-in' });
      toast.success('Signed out successfully');
    },
    onError: async (error) => {
      console.error('Logout failed:', error);
      // Fallback: force sign out of NextAuth even if backend call fails
      // TODO: Remove logic when completed migration
      await signOut({ callbackUrl: '/auth/sign-in' });
    },
  });

  return {
    logout,
    ...props,
  };
}
