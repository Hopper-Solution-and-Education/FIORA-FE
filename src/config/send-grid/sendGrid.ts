'use server';
import sgMail from '@sendgrid/mail';
import { InternalServerError } from '../../shared/lib/responseUtils/errors';
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export const sendEmail = async (to: string, otp: string, verificationLink: string) => {
  try {
    const msg = {
      to,
      from: process.env.SENDER_EMAIL || 'tribui.it.work@gmail.com',
      subject: 'Verify Your Email - Hopper',
      html: emailTemplate(otp, verificationLink), // HTML template from previous response
    };

    await sgMail.send(msg);
  } catch (error) {
    console.error('Failed to send email', error);
    throw new InternalServerError('Failed to send email');
  }
};

export const sendOtp = async (to: string, otp: string) => {
  try {
    const msg = {
      to,
      from: process.env.SENDER_EMAIL || 'tribui.it.work@gmail.com',
      subject: 'Verify Your Email - Hopper',
      html: `<p>Your OTP to reset your password is: <strong>${otp}</strong></p>`,
    };

    await sgMail.send(msg);
    return otp;
  } catch (error) {
    console.error(error);
    throw new InternalServerError('Failed to send email');
  }
};

// Placeholder for the HTML template (kept separate as per request)
const emailTemplate = (otp: string, verificationLink: string) =>
  `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification - Hopper</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f0f4f8; color: #2d3748;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: linear-gradient(135deg, #e6eef5 0%, #f0f4f8 100%); padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0, 50, 100, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(90deg, #007bff, #00c4ff); padding: 30px; text-align: center; position: relative; overflow: hidden;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">Hopper</h1>
              <p style="color: #e6f0ff; margin: 8px 0 0; font-size: 14px; font-style: italic;">Embark on Your Adventure</p>
              <div style="position: absolute; top: -50px; right: -50px; width: 100px; height: 100px; background: rgba(255, 255, 255, 0.1); border-radius: 50%;"></div>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px; text-align: center;">
              <h2 style="font-size: 22px; font-weight: 600; margin: 0 0 25px; color: #1a202c;">Unlock Your Journey</h2>
              <p style="font-size: 16px; line-height: 1.6; margin: 0 0 25px; color: #4a5568;">
                Greetings, traveler! To set sail with Hopper, enter this magical One-Time Password (OTP):
              </p>
              <div style="background: linear-gradient(45deg, #e9f1ff, #f8fafc); padding: 20px; border-radius: 8px; display: inline-block; margin: 25px 0; box-shadow: 0 2px 10px rgba(0, 123, 255, 0.1);">
                <span style="font-size: 28px; font-weight: 700; letter-spacing: 3px; color: #007bff; text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.05);">${otp}</span>
              </div>
              <p style="font-size: 14px; color: #718096; margin: 0 0 25px;">
                Or, take the express route—click below to verify your email instantly:
              </p>
              <a href="${verificationLink}" style="display: inline-block; padding: 14px 30px; background: linear-gradient(90deg, #007bff, #00c4ff); color: #ffffff; text-decoration: none; border-radius: 50px; font-size: 16px; font-weight: 600; transition: transform 0.2s; box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);">
                Verify Now
              </a>
              <p style="font-size: 12px; color: #a0aec0; margin: 25px 0 0; font-style: italic;">
                Hurry! This OTP fades away in 15 minutes. Not you? Let this message drift away.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background: #f7fafc; padding: 25px; text-align: center; font-size: 12px; color: #718096; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0;">© 2025 Hopper. Crafted with care for explorers like you.</p>
              <p style="margin: 8px 0 0;">
                Need a guide? Reach us at <a href="mailto:support@hopper.com" style="color: #007bff; text-decoration: none; font-weight: 500;">support@hopper.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
