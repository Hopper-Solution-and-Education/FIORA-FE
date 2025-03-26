'use client';

import { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

export function useLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: session, status } = useSession();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const searchParams = useSearchParams();
  const router = useRouter();

  console.log('Session:', session);

  const handleCredentialsSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await signIn('credentials', {
        email,
        password,
        rememberMe,
        redirect: false,
      });

      if (response?.ok) {
        setSuccess('Login successful!');
        setEmail(''); // Reset email
        setPassword(''); // Reset password
        router.push('/home');
      } else {
        setError('Login failed. Please try again.');
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setSuccess(null);
    try {
      await signIn('google', { redirect: true, callbackUrl: '/home' });
    } catch (error) {
      console.error('Google login error:', error);
      setError('An unexpected error occurred during Google login.');
    }
  };

  const toggleRememberMe = () => setRememberMe((prev) => !prev);

  return {
    email,
    setEmail,
    password,
    setPassword,
    rememberMe,
    toggleRememberMe,
    error,
    success,
    handleCredentialsSignIn,
    handleGoogleSignIn,
    session,
  };
}
