'use client';

import type React from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/shared/utils';
import { useLogin } from '../../hooks/useLogin';
import { useForgotPassword } from '../../hooks/useForgotPassword';
import EmailOtpForm from './GetOTPForm';
import ResetPasswordForm from './ResetPasswordForm';

const ForgotPasswordForm = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const { handleGoogleSignIn } = useLogin();
  const {
    emailOtpForm,
    resetPasswordForm,
    onSubmitForgotPassword,
    handleOtpSubmit,
    handleResetPasswordSubmit,
    isOtpSent,
    isOtpVerified,
    showNewPassword,
    setShowNewPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    countdown,
  } = useForgotPassword();

  return (
    <div className={cn('flex flex-col items-center gap-6 px-4 sm:px-0', className)} {...props}>
      <Card className="w-full max-w-4xl overflow-hidden border-0 shadow-none">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black dark:text-white">
              FORGOT PASSWORD
            </h1>

            {!isOtpVerified ? (
              <EmailOtpForm
                emailOtpForm={emailOtpForm}
                handleOtpSubmit={handleOtpSubmit}
                onSubmitForgotPassword={onSubmitForgotPassword}
                isOtpSent={isOtpSent}
                countdown={countdown}
              />
            ) : (
              <ResetPasswordForm
                resetPasswordForm={resetPasswordForm}
                handleResetPasswordSubmit={handleResetPasswordSubmit}
                showNewPassword={showNewPassword}
                setShowNewPassword={setShowNewPassword}
                showConfirmPassword={showConfirmPassword}
                setShowConfirmPassword={setShowConfirmPassword}
              />
            )}

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
};

export default ForgotPasswordForm;
