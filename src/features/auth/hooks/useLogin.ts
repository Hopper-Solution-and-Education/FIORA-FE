'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as Yup from 'yup';

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

  const handleCredentialsSignIn = async (data: { email: string; password: string }) => {
    setError(null);
    setSuccess(null);

    try {
      const response = await signIn('credentials', {
        ...data,
        rememberMe,
        redirect: false,
      });

      if (response?.ok) {
        form.reset(); // Reset form fields
        router.push('/');
      } else {
        setError('LoginID or Password is incorrect!');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      console.log(error);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setSuccess(null);
    try {
      await signIn('google', { redirect: true, callbackUrl: '/' });
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
  };
}
