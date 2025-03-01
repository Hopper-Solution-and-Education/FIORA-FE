'use server';
import transporter from '@/lib/nodemailerConfig';

export async function generatedOtpForgotPassword(email: string): Promise<string> {
  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

  const mailOptions = {
    from: `"Hopper Support" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Your Password Reset OTP',
    text: `Your OTP to reset your password is: ${generatedOtp}`,
    html: `<p>Your OTP to reset your password is: <strong>${generatedOtp}</strong></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);

    return generatedOtp;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
}
