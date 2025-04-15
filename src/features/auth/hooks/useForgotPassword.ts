// useForgotPassword.ts
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { sendOtp } from '@/config/send-grid/sendGrid';
import { generateOtp } from '@/shared/utils';
import { toast } from 'sonner';

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
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

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
            setOtp('');
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
    if (!emailOtpForm.formState.errors.email && email) {
      try {
        const generatedOtp = generateOtp();
        await sendOtp(email, generatedOtp);
        setOtp(generatedOtp);
        setIsOtpSent(true);
        setCountdown(60);
        toast.success('OTP sent to your email');
      } catch (error: any) {
        console.error(error);
        toast.error(error?.message ?? 'Failed to send OTP');
      }
    } else {
      toast.error('Please enter a valid email');
    }
  };

  const handleOtpSubmit = async (data: { email: string; otp: string }) => {
    if (!isOtpSent) {
      toast.error('Please request an OTP first');
      return;
    }
    if (otp === data.otp) {
      setIsOtpVerified(true);
      toast.success('OTP verified successfully');
    } else {
      toast.error('Sorry! OTP is not valid');
      emailOtpForm.setValue('otp', '');
    }
  };

  const handleResetPasswordSubmit = async (data: {
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailOtpForm.getValues('email'),
          newPassword: data.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reset password');
      }

      localStorage.setItem('resetPasswordSuccess', 'true');
      router.push('/auth/sign-in?reset=success');
    } catch (error: any) {
      toast.error(error.message || 'Failed to reset password');
    }
  };

  return {
    emailOtpForm,
    resetPasswordForm,
    onSubmitForgotPassword,
    handleOtpSubmit,
    handleResetPasswordSubmit,
    otp,
    isOtpSent,
    isOtpVerified,
    showNewPassword,
    setShowNewPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    countdown,
  };
};
