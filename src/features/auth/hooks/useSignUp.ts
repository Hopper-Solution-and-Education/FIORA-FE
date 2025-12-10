'use client';

import { authService } from '@/features/auth/services/auth.service';
import { SignUpPayload } from '@/features/auth/types/auth.type';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { useMutation } from '@tanstack/react-query';

export function useSignUp() {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: SignUpPayload) => authService.signUp(payload),
    onSuccess: () => {
      localStorage.setItem(
        'signupMsg',
        'Congratulation! You have registered an account successfully.',
      );
      router.push('/auth/sign-in?registerSuccess=true');
      toast.success('Registration successful! Please sign in.');
    },
    onError: (err: any) => {
      console.error('Sign Up Error:', err);
    },
  });
}
