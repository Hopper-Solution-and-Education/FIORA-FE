'use client';

import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { yupResolver } from '@hookform/resolvers/yup';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as Yup from 'yup';
import { authService } from '../services/auth.service';

const loginSchema = Yup.object().shape({
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  password: Yup.string()
    .matches(
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
      'Must be 8+ chars, 1 number, 1 lowercase, 1 uppercase',
    )
    .required('Password is required'),
});

export function useLogin() {
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  const form = useForm({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleCredentialsSignIn = async (
    data: { email: string; password: string },
    callbackUrl?: string,
  ) => {
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const loginResponse = await authService.login({
        email: data.email,
        password: data.password,
        rememberMe: rememberMe,
      });

      if (loginResponse.statusCode === RESPONSE_CODE.OK) {
        // Call NextAuth (Legacy Support)
        // TODO: Remove this after migrating all modules to use the new backend directly
        const response = await signIn('credentials', {
          ...data,
          rememberMe,
          redirect: false,
        });

        if (response?.ok) {
          form.reset(); // Reset form fields
          router.push(callbackUrl || '/');
        } else {
          // If NextAuth fails even though backend succeeded, it might be a sync issue or NextAuth config issue
          // For now, fail if NextAuth fails to ensure consistency
          if (response?.error === Messages.USER_BLOCKED_SIGNIN_ERROR) {
            setError('Your account has been blocked. Please contact support for assistance.');
          } else {
            setError('LoginID or Password is incorrect (Legacy Auth Failed)!');
          }
        }
      } else {
        setError('Login failed: No access token received.');
      }
    } catch (error: any) {
      setError(error?.message || 'An unexpected error occurred. Please try again.');
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async (callbackUrl?: string) => {
    setError(null);
    setSuccess(null);
    try {
      await signIn('google', { redirect: true, callbackUrl: callbackUrl || '/' });
    } catch (error) {
      console.error('Google login error:', error);
      setError('An unexpected error occurred during Google login.');
    }
  };

  const toggleRememberMe = () => setRememberMe((prev) => !prev);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success(success);
    }
  }, [error, success]);

  return {
    form,
    rememberMe,
    toggleRememberMe,
    error,
    success,
    handleCredentialsSignIn,
    handleGoogleSignIn,
    session,
    isLoading,
  };
}
