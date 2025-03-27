// useForgotPassword.ts
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { sendOtp } from '@/config/sendGrid';
import { generateOtp } from '@/shared/utils';
import { toast } from 'sonner'; // Import toast từ sonner

// Định nghĩa schema Yup cho form
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

  // Form cho bước nhập email và OTP
  const emailOtpForm = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      otp: '',
    },
  });

  // Form cho bước nhập mật khẩu mới
  const resetPasswordForm = useForm({
    resolver: yupResolver(resetPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Đếm ngược 60 giây
  useEffect(() => {
    if (countdown === null || countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  // Hàm gửi OTP qua email
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
        toast.success('OTP sent to your email'); // Sử dụng toast thay vì setAlert
      } catch (error) {
        console.error(error);
        toast.error('Failed to send OTP'); // Sử dụng toast thay vì setAlert
      }
    } else {
      toast.error('Please enter a valid email'); // Sử dụng toast thay vì setAlert
    }
  };

  // Hàm xử lý xác nhận OTP
  const handleOtpSubmit = async (data: { email: string; otp: string }) => {
    if (!isOtpSent) {
      toast.error('Please request an OTP first'); // Sử dụng toast thay vì setAlert
      return;
    }
    if (otp === data.otp) {
      setIsOtpVerified(true);
      toast.success('OTP verified successfully'); // Sử dụng toast thay vì setAlert
    } else {
      toast.error('Invalid OTP. Please try again'); // Sử dụng toast thay vì setAlert
      emailOtpForm.setValue('otp', '');
    }
  };

  // Hàm xử lý submit reset password
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

      toast.success('Password reset successfully!'); // Sử dụng toast thay vì setAlert
      router.push('/home');
    } catch (error: any) {
      toast.error(error.message || 'Failed to reset password'); // Sử dụng toast thay vì setAlert
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
