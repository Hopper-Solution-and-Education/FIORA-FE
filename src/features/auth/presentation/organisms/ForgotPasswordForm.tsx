import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { sendOtp } from '@/config/sendGrid';
import { generateOtp } from '@/shared/utils';
import { validateConfirmPassword, validatePassword } from '@/shared/validation/signUpValidation';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

const ForgotPassword = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [inputOtp, setInputOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [alert, setAlert] = useState<{
    message: string;
    variant: 'default' | 'destructive';
  } | null>(null);
  const [fieldErrors, setFieldErrors] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const router = useRouter();

  // Hàm gửi OTP qua email
  const onSubmitForgotPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const otp = await sendOtp(email, generateOtp());
      setOtp(otp);
      setIsOtpSent(true);
      setAlert(null);
    } catch (error) {
      setAlert({ message: 'Failed to send OTP', variant: 'destructive' });
    }
  };

  // Hàm xử lý xác nhận OTP
  const handleOtpSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otp === inputOtp) {
      setIsOtpVerified(true);
      setAlert(null);
    } else {
      setAlert({ message: 'Invalid OTP. Please try again', variant: 'destructive' });
      setInputOtp('');
    }
  };

  // Hàm validate form reset password
  const validateResetPasswordForm = (newPassword: string, confirmPassword: string) => {
    const passwordError = validatePassword(newPassword);
    const confirmPasswordError = validateConfirmPassword(confirmPassword, newPassword);

    setFieldErrors({
      newPassword: passwordError,
      confirmPassword: confirmPasswordError,
    });

    return !passwordError && !confirmPasswordError;
  };

  // Hàm xử lý submit reset password
  const handleResetPasswordSubmit = async (
    values: { newPassword: string; confirmPassword: string },
    { setSubmitting }: FormikHelpers<{ newPassword: string; confirmPassword: string }>,
  ) => {
    if (!validateResetPasswordForm(values.newPassword, values.confirmPassword)) {
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          newPassword: values.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reset password');
      }

      const data = await response.json();
      setAlert({ message: 'Password reset successfully!', variant: 'default' });
      router.push('/home');
    } catch (error: any) {
      setAlert({ message: error.message || 'Failed to reset password', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  // Xử lý thay đổi input và validate real-time
  const handleFieldChange = (
    field: string,
    value: string,
    setFieldValue: (field: string, value: any) => void,
    password?: string,
  ) => {
    switch (field) {
      case 'newPassword':
        setFieldValue('newPassword', value); // Cập nhật giá trị qua Formik
        setFieldErrors((prev) => ({ ...prev, newPassword: validatePassword(value) }));
        break;
      case 'confirmPassword':
        setFieldValue('confirmPassword', value); // Cập nhật giá trị qua Formik
        setFieldErrors((prev) => ({
          ...prev,
          confirmPassword: validateConfirmPassword(value, password || ''),
        }));
        break;
    }
    setAlert(null);
  };

  return (
    <div className={cn('flex flex-col gap-6 max-w-md mx-auto', className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="p-6 md:p-8">
          {alert && (
            <Alert variant={alert.variant} className="mb-6">
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          )}

          {!isOtpSent ? (
            // Form nhập email
            <form onSubmit={onSubmitForgotPassword} className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Forgot Password</h1>
                <p className="text-balance text-muted-foreground">
                  Enter your email to reset your password
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="m@example.com"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Send Reset Link
              </Button>
            </form>
          ) : !isOtpVerified ? (
            // Form nhập OTP
            <form onSubmit={handleOtpSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Verify OTP</h1>
                <p className="text-balance text-muted-foreground">Enter the OTP sent to {email}</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="otp">OTP Code</Label>
                <Input
                  id="otp"
                  type="text"
                  value={inputOtp}
                  onChange={(e) => setInputOtp(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Verify OTP
              </Button>
            </form>
          ) : (
            // Form nhập mật khẩu mới
            <Formik
              initialValues={{ newPassword: '', confirmPassword: '' }}
              onSubmit={handleResetPasswordSubmit}
            >
              {({ isSubmitting, values, setFieldValue }) => (
                <Form className="flex flex-col gap-8">
                  <div className="flex flex-col items-center text-center gap-3">
                    <h1 className="text-3xl font-bold">Reset Password</h1>
                    <p className="text-lg text-muted-foreground">Enter your new password below</p>
                  </div>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="new-password" className="text-base">
                        New Password
                      </Label>
                      <Field
                        as={Input}
                        id="new-password"
                        name="newPassword"
                        type="password"
                        placeholder="Enter new password"
                        className={cn(
                          'h-12 text-base',
                          fieldErrors.newPassword && 'border-red-500',
                        )}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleFieldChange('newPassword', e.target.value, setFieldValue)
                        }
                        required
                      />
                      {fieldErrors.newPassword && (
                        <p className="text-base text-red-500">{fieldErrors.newPassword}</p>
                      )}
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="confirm-password" className="text-base">
                        Confirm Password
                      </Label>
                      <Field
                        as={Input}
                        id="confirm-password"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm new password"
                        className={cn(
                          'h-12 text-base',
                          fieldErrors.confirmPassword && 'border-red-500',
                        )}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleFieldChange(
                            'confirmPassword',
                            e.target.value,
                            setFieldValue,
                            values.newPassword,
                          )
                        }
                        required
                      />
                      {fieldErrors.confirmPassword && (
                        <p className="text-base text-red-500">{fieldErrors.confirmPassword}</p>
                      )}
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-12 text-lg" disabled={isSubmitting}>
                    Reset Password
                  </Button>
                </Form>
              )}
            </Formik>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
