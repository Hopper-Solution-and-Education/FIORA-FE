import { ErrorMessage, Field, Form, Formik } from 'formik';
import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { resetPasswordSchema } from '@/shared/schemas/forgotPassword';
import { generatedOtpForgotPassword } from '../../application/use-cases/emailUseCase';

const ForgotPassword = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false); // Trạng thái mới cho việc verify OTP
  const resetPasswordSchemaObj = resetPasswordSchema(newPassword, confirmPassword);

  const onSubmitForgotPassword = async () => {
    const otp = await generatedOtpForgotPassword(email);
    setOtp(otp);
    setIsOtpSent(true);
  };

  // Xử lý xác nhận OTP
  const handleOtpSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inputOtp = (document.getElementById('otp') as HTMLInputElement)?.value;
    if (otp === inputOtp) {
      setIsOtpVerified(true);
    } else {
      alert('Invalid OTP. Please try again');
    }
  };

  // Xử lý reset password
  const handleResetPassword = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className={cn('flex flex-col gap-6 max-w-md mx-auto', className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="p-6 md:p-8">
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
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
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
              onSubmit={(values, { setSubmitting }) => {
                // Logic reset password (gọi API ở đây)
                setSubmitting(false);
              }}
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
