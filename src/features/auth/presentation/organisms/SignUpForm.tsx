'use client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
  validateConfirmPassword,
  validateEmail,
  validatePassword,
} from '@/shared/validation/signUpValidation';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AppleButton from '../common/AppleButton';
import GoogleButton from '../common/GoogleButton';
import MetaButton from '../common/MetaButton';
import TermCondition from '../common/TermCondition';
import { VerifyOTPForm } from './VerifyForm';
// import { Router, useRouter } from 'next/router';

// Validation regex patterns

export function SignUpForm({ className, ...props }: React.ComponentProps<'div'>) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isVerificationStep, setIsVerificationStep] = useState(false); // Toggle between registration and verification
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null); // State for error messages
  // State for field-specific errors
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    otp: '',
  });

  const validateForm = () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(confirmPassword, password);

    setFieldErrors({
      ...fieldErrors,
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
    });

    return !emailError && !passwordError && !confirmPasswordError;
  };

  const handleFieldChange = (field: string, value: string) => {
    switch (field) {
      case 'email':
        setEmail(value);
        setFieldErrors((prev) => ({ ...prev, email: validateEmail(value) }));
        break;
      case 'password':
        setPassword(value);
        setFieldErrors((prev) => ({ ...prev, password: validatePassword(value) }));
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        setFieldErrors((prev) => ({
          ...prev,
          confirmPassword: validateConfirmPassword(value, password),
        }));
        break;
    }
    setError(null);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear any global errors

    if (!validateForm()) {
      return;
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'An error occurred during sign up');
      }

      const data = await res.json();

      setSuccessMessage(data.message); // e.g., "Check your email for OTP"
      // setIsVerificationStep(true); // Switch to OTP verification step
      setTimeout(() => {
        router.push('/auth/sign-in');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign up');
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0">
          <div className="flex flex-col items-center text-center gap-2">
            <h1 className="text-2xl font-bold py-2 mt-3">
              {isVerificationStep ? 'Verify Your Email' : 'Create an Account'}
            </h1>
            <p className="text-balance text-muted-foreground">
              {isVerificationStep
                ? 'Enter the OTP sent to your email'
                : 'Sign up for your Hopper account'}
            </p>
          </div>
          <div className="p-6 md:p-8">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {successMessage && (
              <Alert variant="default" className="mb-4 border-green-500">
                <AlertDescription className="text-green-600">{successMessage}</AlertDescription>
              </Alert>
            )}

            {!isVerificationStep ? (
              <form onSubmit={handleRegister} className="flex flex-col gap-3">
                <div className="grid gap-2 mt-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    placeholder="example@gmail.com"
                    required
                    className={cn('border-gray-300', fieldErrors.email && 'border-red-500')}
                  />
                  {fieldErrors.email && (
                    <p className="text-red-500 text-sm mt-1 break-words">{fieldErrors.email}</p>
                  )}
                </div>
                <div className="grid gap-2 mt-4">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => handleFieldChange('password', e.target.value)}
                    required
                    className={cn('border-gray-300', fieldErrors.password && 'border-red-500')}
                  />
                  {fieldErrors.password && (
                    <p className="text-red-500 text-sm mt-1 break-all">{fieldErrors.password}</p>
                  )}
                </div>
                <div className="grid gap-2 mt-4">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                    required
                    className={cn(
                      'border-gray-300',
                      fieldErrors.confirmPassword && 'border-red-500',
                    )}
                  />
                  {fieldErrors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.confirmPassword}</p>
                  )}
                </div>
                <TermCondition />
                <Button type="submit" className="w-full mt-4">
                  Sign Up
                </Button>
              </form>
            ) : (
              <VerifyOTPForm
                email={email}
                setError={setError}
                setSuccessMessage={setSuccessMessage}
              />
            )}
            {!isVerificationStep && (
              <>
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border mt-3">
                  <span className="relative z-10 bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <AppleButton />
                  <GoogleButton />
                  <MetaButton />
                </div>
                <div className="text-center text-sm mt-4">
                  Already have an account?{' '}
                  <Link href="/auth/sign-in" className="underline underline-offset-4">
                    Login
                  </Link>
                </div>
              </>
            )}
          </div>

          <div className="relative hidden bg-muted md:block">
            <Image
              src="/placeholder.svg"
              alt="Image"
              layout="fill"
              objectFit="cover"
              className="absolute inset-0 dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
