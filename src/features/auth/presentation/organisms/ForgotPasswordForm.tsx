'use client';

import type React from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/shared/utils';
import { useForgotPassword } from '../../hooks/useForgotPassword';
import { useLogin } from '../../hooks/useLogin';
import GoogleIcon from '../components/GoogleIcon';
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
    isLoading,
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
                isLoading={isLoading}
              />
            ) : (
              <ResetPasswordForm
                resetPasswordForm={resetPasswordForm}
                handleResetPasswordSubmit={handleResetPasswordSubmit}
                showNewPassword={showNewPassword}
                setShowNewPassword={setShowNewPassword}
                showConfirmPassword={showConfirmPassword}
                setShowConfirmPassword={setShowConfirmPassword}
                isLoading={isLoading}
              />
            )}

            <Separator orientation="horizontal" className="border-foreground border-1" />

            <div className="relative flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="relative z-10 px-1">Or Sign in with</span>
              <button
                data-test="forgot-password-form-google-sign-in"
                onClick={() => handleGoogleSignIn()}
                className="flex items-center justify-center w-8 h-8 cursor-pointer"
              >
                <GoogleIcon />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordForm;
