'use client';

import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { useAppDispatch } from '@/store';
import { setUserData } from '@/store/slices/user.slice';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
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
  const { data: session } = useSession();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const form = useForm({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: any) => {
      const loginResponse = await authService.login({
        email: data.email,
        password: data.password,
        rememberMe: rememberMe,
      });
      return loginResponse;
    },
    onSuccess: async (loginResponse, variables) => {
      if (loginResponse.statusCode === RESPONSE_CODE.OK) {
        dispatch(
          setUserData({
            user: loginResponse.data.user,
          }),
        );
        // TODO: Remove logic when completed migration
        const response = await signIn('credentials', {
          ...variables,
          rememberMe,
          redirect: false,
        });

        if (response?.ok) {
          form.reset();
          router.push(variables.callbackUrl || '/');
          toast.success('Login successful!');
        } else {
          if (response?.error === Messages.USER_BLOCKED_SIGNIN_ERROR) {
            setError('Your account has been blocked. Please contact support for assistance.');
          } else {
            setError('LoginID or Password is incorrect (Legacy Auth Failed)!');
          }
        }
      } else {
        setError('Login failed: No access token received.');
      }
    },
    onError: (err: any) => {
      setError(err?.message || 'An unexpected error occurred. Please try again.');
      console.log(err);
    },
  });

  const handleCredentialsSignIn = (
    data: { email: string; password: string },
    callbackUrl?: string,
  ) => {
    setError(null);
    loginMutation.mutate({ ...data, callbackUrl });
  };

  const handleGoogleSignIn = async (callbackUrl?: string) => {
    setError(null);
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
  }, [error]);

  return {
    form,
    rememberMe,
    toggleRememberMe,
    error,
    handleCredentialsSignIn,
    handleGoogleSignIn,
    session,
    isLoading: loginMutation.isPending,
  };
}
