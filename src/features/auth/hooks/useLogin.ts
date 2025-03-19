'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

export function useLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();

  console.log('Session:', session);

  // check whether gg or credential login
  useEffect(() => {
    const loginType = searchParams?.get('type');
    if (loginType === 'google') {
      setSuccess('Google Login successful!');
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

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
      } else {
        setError(response?.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setSuccess(null);
    try {
      await signIn('google', { redirect: true, callbackUrl: '/auth/sign-in?type=google' });
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
