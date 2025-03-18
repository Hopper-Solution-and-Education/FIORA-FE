'use client';

import type React from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/shared/utils';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCredentialsSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await signIn('credentials', {
        email,
        password,
        rememberMe,
        redirect: false,
      });
      if (response?.ok) {
        router.push('/home');
      } else {
        if (response?.error) {
          setError('Invalid email or password. Please try again.');
        } else {
          setError('Login failed. Please try again.');
        }
      }
    } catch (error: any) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      const res = await signIn('google', { callbackUrl: '/home' });
      if (!res?.ok) {
        setError('Google login failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Google login error:', error);
      setError('An unexpected error occurred during Google login.');
    }
  };

  const toggleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  return (
    <div className={cn('flex flex-col items-center gap-6', className)} {...props}>
      <Card className="w-full max-w-xl overflow-hidden border-0 shadow-none">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-2xl font-bold text-black dark:text-white">SIGN IN</h1>

            {error && (
              <Alert variant="destructive" className="mb-4 w-full text-sm">
                <AlertDescription className="text-red-700 dark:text-red-400">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleCredentialsSignIn} className="w-full space-y-4">
              <div className="flex flex-col sm:flex-row w-full gap-2 sm:gap-4 sm:items-center">
                <Label
                  htmlFor="email"
                  className="text-sm text-foreground w-full sm:w-1/4 text-left sm:text-right"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@flora.live"
                  className="w-full sm:flex-1 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-none"
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row w-full gap-2 sm:gap-4 sm:items-center">
                <Label
                  htmlFor="password"
                  className="text-sm text-foreground w-full sm:w-1/4 text-left sm:text-right"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full sm:flex-1 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-none"
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row w-full gap-2 sm:gap-4 sm:items-center">
                <div className="w-full sm:w-1/4"></div>
                <div className="w-full sm:flex-1 flex items-center gap-2">
                  <Checkbox
                    id="remember-me"
                    checked={rememberMe}
                    onCheckedChange={toggleRememberMe}
                    className="h-4 w-4 cursor-pointer rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 data-[state=checked]:bg-blue-500 dark:data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-500 dark:data-[state=checked]:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  />
                  <Label
                    htmlFor="remember-me"
                    className="text-sm text-foreground/80 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleRememberMe();
                    }}
                  >
                    Remember me
                  </Label>
                </div>
              </div>

              <div className="flex justify-center w-full mt-7">
                <Button
                  type="submit"
                  className="text-lg font-semibold w-48 py-4 bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  Go
                </Button>
              </div>
            </form>

            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              <div className="mb-2 sm:mb-0 sm:inline">
                Cannot sign in?{' '}
                <Link
                  href="/auth/sign-in/forgot-password"
                  className="text-blue-500 hover:underline sm:mr-3 font-medium"
                >
                  Forgot password
                </Link>
              </div>{' '}
              <div className="sm:inline">
                Do not have an account?{' '}
                <Link href="/auth/sign-up" className="text-blue-500 hover:underline font-medium">
                  Sign up
                </Link>
              </div>
            </div>

            <Separator orientation="horizontal" className="border-foreground border-1" />

            <div className="relative flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="relative z-10 px-1">Or Sign in with</span>
              <button
                onClick={handleGoogleSignIn}
                className="flex items-center justify-center w-8 h-8 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  ></path>
                  <path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  ></path>
                  <path
                    fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  ></path>
                  <path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
