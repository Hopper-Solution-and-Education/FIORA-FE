'use client';

import { authService } from '@/features/auth/services/auth.service';
import { RouteEnum } from '@/shared/constants/RouteEnum';
import { routeConfig } from '@/shared/utils/route';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as Yup from 'yup';

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  otp: Yup.string().required('OTP is required').length(6, 'OTP must be 6 digits'),
});

const resetPasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .matches(
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
      'Must be 8+ chars, 1 number, 1 lowercase, 1 uppercase',
    )
    .required('New Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Confirm Password is required'),
});

export const useForgotPassword = () => {
  const router = useRouter();
  const [userOtp, setUserOtp] = useState(''); // Stores the OTP entered by the user
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false); // Transitions UI from OTP step to Password step
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const emailOtpForm = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      otp: '',
    },
  });

  const resetPasswordForm = useForm({
    resolver: yupResolver(resetPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (countdown === null || countdown < 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev !== null) {
          const newCount = prev - 1;
          if (newCount <= 0) {
            setIsOtpSent(false);
            setUserOtp('');
          }
          return newCount;
        }
        return null;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const onSubmitForgotPassword = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const email = emailOtpForm.getValues('email');
    if (emailOtpForm.formState.errors.email && email) {
      toast.error('Please enter a valid email');
      return;
    }

    setIsLoading(true);
    try {
      await authService.sendOtp(email);

      setIsOtpSent(true);
      setCountdown(60); // Start countdown
      toast.success('OTP sent to your email');
    } catch (error: any) {
      console.error(error);
      const errorMessage = error?.message || 'Failed to send OTP';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (data: { email: string; otp: string }) => {
    if (!isOtpSent) {
      toast.error('Please request an OTP first');
      return;
    }

    setUserOtp(data.otp);
    setIsOtpVerified(true);
  };

  const handleResetPasswordSubmit = async (data: {
    newPassword: string;
    confirmPassword: string;
  }) => {
    setIsLoading(true);
    try {
      await authService.resetPassword({
        email: emailOtpForm.getValues('email'),
        newPassword: data.newPassword,
        otp: userOtp,
      });

      localStorage.setItem('resetPasswordSuccess', 'true');

      router.push(routeConfig(RouteEnum.SignIn, {}, { reset: 'success' }));
      toast.success('Password reset successfully');
    } catch (error: any) {
      let errorMessage = 'Failed to reset password';

      // Try to parse error message from JSON response
      if (error?.message) {
        try {
          const errorData = JSON.parse(error.message);
          errorMessage = errorData.error || errorData.message || error.message;
        } catch {
          errorMessage = error.message;
        }
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    emailOtpForm,
    resetPasswordForm,
    onSubmitForgotPassword,
    handleOtpSubmit,
    handleResetPasswordSubmit,
    otp: userOtp, // expose as 'otp' to maintain compatibility if UI uses it
    isOtpSent,
    isOtpVerified,
    showNewPassword,
    setShowNewPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    countdown,
    isLoading,
  };
};
