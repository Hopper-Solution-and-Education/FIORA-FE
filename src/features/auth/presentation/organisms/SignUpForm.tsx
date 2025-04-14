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
import { Check, Eye, EyeOff, Loader2 } from 'lucide-react';
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

  // Add states for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      const res = await signIn('google', { callbackUrl: '/' });
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
                    <p className="w-full  text-red-500 text-sm break-words">{fieldErrors.email}</p>
                  )}
                  <div className="relative flex flex-col sm:flex-row justify-start items-start sm:items-center gap-2 mt-2">
                    <Label
                      htmlFor="password"
                      className="block sm:absolute sm:top-[50%] sm:-left-4 sm:-translate-y-[50%] sm:-translate-x-[100%] text-sm text-right text-gray-700 dark:text-gray-300 sm:w-1/4"
                    >
                      Password
                    </Label>
                    <div className="relative flex-1">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        disabled={isRegistering}
                        value={password}
                        onChange={(e) => handleFieldChange('password', e.target.value)}
                        required
                        className={cn(
                          'flex-1 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 py-2 pr-10',
                          fieldErrors.password ? 'border-red-500' : 'border-none',
                        )}
                      />
                      {password && (
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center pr-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                  {fieldErrors.password && (
                    <p className="w-full text-red-500 text-sm mt-1">{fieldErrors.password}</p>
                  )}

                  <div className="relative flex flex-col sm:flex-row justify-start items-start sm:items-center gap-2 mt-2">
                    <Label
                      htmlFor="confirm-password"
                      className="block sm:absolute sm:top-[50%] sm:-left-4 sm:-translate-y-[50%] sm:-translate-x-[100%] text-sm text-right text-gray-700 dark:text-gray-300 sm:w-1/4"
                    >
                      Confirm Password
                    </Label>
                    <div className="relative flex-1">
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        disabled={isRegistering}
                        value={confirmPassword}
                        onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                        required
                        className={cn(
                          'flex-1 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 py-2 pr-10',
                          fieldErrors.confirmPassword ? 'border-red-500' : 'border-none',
                        )}
                      />
                      {confirmPassword && (
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center pr-3"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p className="w-full text-red-500 text-sm mt-1 break-all">
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
                        'text-lg font-semibold w-48 py-6 bg-blue-500  hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700',
                        isRegistering && 'cursor-not-allowed',
                      )}
                      disabled={isSignUpNotAvailable}
                    >
                      {!isRegistering ? (
                        <Check className="block text-green-300 stroke-[4] transform transition-transform duration-200 drop-shadow-sm hover:text-green-100 !h-[23px] !w-[23px]" />
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
