'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import TermCondition from '@/features/auth/presentation/common/TermCondition';
import { cn } from '@/shared/utils';
import {
  validateConfirmPassword,
  validateEmail,
  validatePassword,
} from '@/shared/validation/signUpValidation';
import { Check, Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const SignUpForm = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isVerificationStep, setIsVerificationStep] = useState(false); // Toggle between registration and verification
  const [isTermAccepted, setIsTermAccepted] = useState<boolean>(false);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
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

  const handleGoogleSignIn = async () => {
    setError(null); // Reset lỗi trước khi thử đăng nhập
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear any global errors

    if (!validateForm()) {
      return;
    }

    try {
      setIsRegistering(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.status !== 201) {
        setError(data.message);
        return;
      }

      router.push('/auth/sign-in?registerSuccess=true');
      localStorage.setItem(
        'signupMsg',
        'Congratulation! You have registered an account successfully.',
      );
      // setIsVerificationStep(true); // Switch to OTP verification step
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsRegistering(false);
    }
  };

  const isSignUpNotAvailable: boolean =
    !isTermAccepted ||
    isRegistering ||
    !(email.length > 0) ||
    !(password.length > 0) ||
    !(confirmPassword.length > 0) ||
    !!error || // Explicitly check if error is truthy
    fieldErrors.email.length > 0 ||
    fieldErrors.password.length > 0 ||
    fieldErrors.confirmPassword.length > 0;

  return (
    <div
      className={cn('flex flex-col items-center gap-6 overflow-visible dark:bg-black', className)}
      {...props}
    >
      <Card className="w-full max-w-xl border-0 shadow-none px-[10%]">
        <CardContent className="grid p-0">
          <div className="flex flex-col items-center text-center gap-2">
            <h1 className="text-2xl font-bold mt-3">
              {isVerificationStep ? 'Verify Your Email' : 'SIGN UP'}
            </h1>
          </div>
          <div className="p-6 md:p-8">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription className="text-center">{error}</AlertDescription>
              </Alert>
            )}
            {
              !isVerificationStep && (
                <form onSubmit={handleRegister} className="flex flex-col gap-3 overflow-visible">
                  <div className="relative flex flex-col sm:flex-row justify-start items-start sm:items-center gap-2">
                    <Label
                      htmlFor="email"
                      className="block sm:absolute sm:top-[50%] sm:-left-4 sm:-translate-y-[50%] sm:-translate-x-[100%] text-sm text-right text-gray-700 dark:text-gray-300 sm:w-1/4"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      inputMode="email"
                      disabled={isRegistering} // Disable during register period
                      value={email}
                      onChange={(e) => handleFieldChange('email', e.target.value)}
                      // onBlur={validateExistedEmail} // Validate khi người dùng rời khỏi trường input
                      placeholder="example@gmail.com"
                      required
                      className={cn(
                        'flex-1 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 py-2',
                        fieldErrors.email ? 'border-red-500' : 'border-none',
                      )}
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="w-full pl-[30%] text-red-500 text-sm break-words">
                      {fieldErrors.email}
                    </p>
                  )}
                  <div className="relative flex flex-col sm:flex-row justify-start items-start sm:items-center gap-2 mt-2">
                    <Label
                      htmlFor="password"
                      className="block sm:absolute sm:top-[50%] sm:-left-4 sm:-translate-y-[50%] sm:-translate-x-[100%] text-sm text-right text-gray-700 dark:text-gray-300 sm:w-1/4"
                    >
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      disabled={isRegistering} // Disable during register period
                      value={password}
                      onChange={(e) => handleFieldChange('password', e.target.value)}
                      required
                      className={cn(
                        'flex-1 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 py-2',
                        fieldErrors.password ? 'border-red-500' : 'border-none',
                      )}
                    />
                  </div>
                  {fieldErrors.password && (
                    <p className="w-full pl-[30%] text-red-500 text-sm mt-1">
                      {fieldErrors.password}
                    </p>
                  )}
                  <div className="relative flex flex-col sm:flex-row justify-start items-start sm:items-center gap-2 mt-2">
                    <Label
                      htmlFor="confirm-password"
                      className="block sm:absolute sm:top-[50%] sm:-left-4 sm:-translate-y-[50%] sm:-translate-x-[100%] text-sm text-right text-gray-700 dark:text-gray-300 sm:w-1/4"
                    >
                      Confirm Password
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      disabled={isRegistering} // Disable during register period
                      value={confirmPassword}
                      onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                      required
                      className={cn(
                        'flex-1 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 py-2',
                        fieldErrors.confirmPassword ? 'border-red-500' : 'border-none',
                      )}
                    />
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p className="w-full pl-[30%] text-red-500 text-sm mt-1 break-all">
                      {fieldErrors.confirmPassword}
                    </p>
                  )}
                  <TermCondition
                    isTermAccepted={isTermAccepted}
                    setIsTermAccepted={setIsTermAccepted}
                    isEditAlowed={!isRegistering}
                  />
                  <div className="w-full h-fit my-4 flex justify-center">
                    <Button
                      type="submit"
                      className={cn(
                        'text-lg font-semibold w-48 py-4 bg-blue-500  hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700',
                        isRegistering && 'cursor-not-allowed',
                      )}
                      disabled={isSignUpNotAvailable}
                    >
                      {isSignUpNotAvailable ? (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 15 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7.49985 0.877045C3.84216 0.877045 0.877014 3.84219 0.877014 7.49988C0.877014 9.1488 1.47963 10.657 2.47665 11.8162L1.64643 12.6464C1.45117 12.8417 1.45117 13.1583 1.64643 13.3535C1.8417 13.5488 2.15828 13.5488 2.35354 13.3535L3.18377 12.5233C4.34296 13.5202 5.85104 14.1227 7.49985 14.1227C11.1575 14.1227 14.1227 11.1575 14.1227 7.49988C14.1227 5.85107 13.5202 4.34299 12.5233 3.1838L13.3535 2.35354C13.5488 2.15827 13.5488 1.84169 13.3535 1.64643C13.1583 1.45117 12.8417 1.45117 12.6464 1.64643L11.8162 2.47668C10.657 1.47966 9.14877 0.877045 7.49985 0.877045ZM11.1422 3.15066C10.1567 2.32449 8.88639 1.82704 7.49985 1.82704C4.36683 1.82704 1.82701 4.36686 1.82701 7.49988C1.82701 8.88642 2.32446 10.1568 3.15063 11.1422L11.1422 3.15066ZM3.85776 11.8493C4.84317 12.6753 6.11343 13.1727 7.49985 13.1727C10.6328 13.1727 13.1727 10.6329 13.1727 7.49988C13.1727 6.11346 12.6753 4.8432 11.8493 3.85779L3.85776 11.8493Z"
                            fill="currentColor"
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                      ) : !isRegistering ? (
                        <Check size={50} strokeWidth={2} />
                      ) : (
                        <Loader2 className="h-full w-full text-primary animate-spin" />
                      )}
                    </Button>
                  </div>
                  <div className="text-center text-sm mt-4">
                    Already have an account?{' '}
                    <Link
                      href="/auth/sign-in"
                      className="underline underline-offset-4 text-blue-500 hover:text-blue-600"
                    >
                      Login
                    </Link>
                  </div>
                </form>
              )
              // : (
              //   <VerifyOTPForm
              //     email={email}
              //     setError={setError}
              //     setSuccessMessage={setSuccessMessage}
              //   />
              // )
            }
            {!isVerificationStep && (
              <div className="w-full h-fit flex flex-col pt-6 gap-6">
                <Separator orientation="horizontal" />

                <div className="relative flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="relative z-10 px-2">Or Sign in with</span>
                  <button
                    onClick={handleGoogleSignIn}
                    className="flex items-center justify-center w-8 h-8 cursor-pointer"
                  >
                    {/* Google Icon SVG */}
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
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpForm;
