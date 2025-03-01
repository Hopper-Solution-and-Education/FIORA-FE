import { FormEvent, useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import { resetPasswordSchema } from '@/shared/schemas/forgotPassword';
import { generatedOtpForgotPassword } from '../../application/use-cases/emailUseCase';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';

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
  const resetPasswordSchemaObj = resetPasswordSchema();
  const router = useRouter();

  // Hàm gửi OTP qua email
  const onSubmitForgotPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const otp = await generatedOtpForgotPassword(email);
      setOtp(otp);
      setIsOtpSent(true);
      setAlert(null); // Reset alert nếu có
    } catch (error) {
      setAlert({ message: 'Failed to send OTP', variant: 'destructive' });
    }
  };

  // Hàm xử lý xác nhận OTP
  const handleOtpSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otp === inputOtp) {
      setIsOtpVerified(true);
      setAlert(null); // Reset alert nếu thành công
    } else {
      setAlert({ message: 'Invalid OTP. Please try again', variant: 'destructive' });
      setInputOtp(''); // Reset input nếu sai
    }
  };

  // Hàm xử lý submit reset password
  const handleResetPasswordSubmit = async (
    values: { newPassword: string; confirmPassword: string },
    { setSubmitting }: FormikHelpers<{ newPassword: string; confirmPassword: string }>,
  ) => {
    try {
      const response = await fetch('/api/auth/signin', {
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
      router.push('/dashboard');
    } catch (error: any) {
      setAlert({ message: error.message || 'Failed to reset password', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={cn('flex flex-col gap-6 max-w-md mx-auto', className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="p-6 md:p-8">
          {/* Hiển thị Alert nếu có */}
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
              validationSchema={resetPasswordSchemaObj}
              onSubmit={handleResetPasswordSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Reset Password</h1>
                    <p className="text-balance text-muted-foreground">Enter your new password</p>
                  </div>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Field
                        as={Input}
                        id="new-password"
                        name="newPassword"
                        type="password"
                        placeholder="Enter new password"
                        required
                      />
                      <ErrorMessage
                        name="newPassword"
                        component="div"
                        className="text-sm text-red-500"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Field
                        as={Input}
                        id="confirm-password"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm new password"
                        required
                      />
                      <ErrorMessage
                        name="confirmPassword"
                        component="div"
                        className="text-sm text-red-500"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
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
