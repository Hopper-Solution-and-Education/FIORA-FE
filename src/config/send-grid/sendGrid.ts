'use server';
import { emailTemplateRepository } from '@/features/setting/api/infrastructure/repositories/emailTemplateRepository';
import { emailType } from '@prisma/client';
import sgMail from '@sendgrid/mail';
import { BadRequestError, InternalServerError } from '../../shared/lib/responseUtils/errors';
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export const sendEmail = async (to: string, otp: string, verificationLink: string) => {
  try {
    const msg = {
      to,
      from: process.env.SENDER_EMAIL || 'tribui.it.work@gmail.com',
      subject: 'Verify Your Email - Hopper',
      html: emailTemplate(otp, verificationLink), // HTML template from previous response
    };

    // await sgMail.send(msg);
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

    // await sgMail.send(msg);
    return otp;
  } catch (error) {
    console.error(error);
    throw new InternalServerError('Failed to send email');
  }
};

export const sendOtpVerify = async (to: string, otp: string) => {
  try {
    const msg = {
      to,
      from: process.env.SENDER_EMAIL || 'tribui.it.work@gmail.com',
      subject: 'Verify Your Email - Hopper',
      html: `<p>Your OTP to verify account is: <strong>${otp}</strong></p>`,
    };

    // await sgMail.send(msg);
    return otp;
  } catch (error) {
    console.error(error);
    throw new InternalServerError('Failed to send email');
  }
};

export const sendOtpChangeEmail = async (to: string, otp: string) => {
  try {
    const msg = {
      to,
      from: process.env.SENDER_EMAIL || 'tribui.it.work@gmail.com',
      subject: 'Verify Email Change - Hopper',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Email Change Verification</h2>
          <p>You have requested to change your email address.</p>
          <p>Your OTP is: <strong style="font-size: 24px; color: #007bff;">${otp}</strong></p>
          <p>This OTP will expire in 2 minutes.</p>
          <p>If you did not request this change, please ignore this email.</p>
        </div>
      `,
    };

    // await sgMail.send(msg);
    return otp;
  } catch (error) {
    console.error(error);
    throw new InternalServerError('Failed to send email');
  }
};

export const sendOtpDeleteAccount = async (to: string, otp: string) => {
  try {
    const msg = {
      to,
      from: process.env.SENDER_EMAIL || 'tribui.it.work@gmail.com',
      subject: 'Account Deletion Verification - Hopper',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #dc3545;">Account Deletion Verification</h2>
          <p><strong>Warning:</strong> You have requested to delete your account. This action is permanent and cannot be undone.</p>
          <p>Your OTP is: <strong style="font-size: 24px; color: #dc3545;">${otp}</strong></p>
          <p>This OTP will expire in 2 minutes.</p>
          <p>If you did not request this, please secure your account immediately.</p>
        </div>
      `,
    };

    // await sgMail.send(msg);
    return otp;
  } catch (error) {
    console.error(error);
    throw new InternalServerError('Failed to send email');
  }
};

export const sendBulkEmailUtility = async (
  recipients: string[],
  subject: string,
  htmlContent: string,
  options?: {
    from?: string;
    batchSize?: number;
    delayBetweenBatches?: number;
  },
) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

  const {
    from = process.env.SENDER_EMAIL || 'admin@fiora.live',
    batchSize = 1000,
    delayBetweenBatches = 1000,
  } = options || {};

  try {
    // Validate inputs
    if (!recipients || recipients.length === 0) {
      throw new BadRequestError('Recipients list is empty');
    }

    if (!subject || !htmlContent) {
      throw new BadRequestError('Subject and HTML content are required');
    }

    // Clean and validate emails
    const validEmails = recipients
      .filter((email) => email && typeof email === 'string' && email.includes('@'))
      .filter((email, index, self) => self.indexOf(email) === index);

    if (validEmails.length === 0) {
      throw new BadRequestError('No valid email addresses found');
    }

    // Split into batches
    const batches: string[][] = [];
    for (let i = 0; i < validEmails.length; i += batchSize) {
      batches.push(validEmails.slice(i, i + batchSize));
    }

    console.log(`Sending ${validEmails.length} emails in ${batches.length} batches`);

    let sentCount = 0;
    let failedCount = 0;
    const failedEmails: string[] = [];

    // Process batches
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];

      try {
        const msg = {
          to: batch,
          from,
          subject,
          html: htmlContent,
        };

        // await sgMail.send(msg);
        sentCount += batch.length;

        console.log(
          `Batch ${i + 1}/${batches.length} sent successfully to ${batch.length} recipients`,
        );

        // Delay between batches
        if (i < batches.length - 1 && delayBetweenBatches > 0) {
          await new Promise((resolve) => setTimeout(resolve, delayBetweenBatches));
        }
      } catch (batchError) {
        console.error(`Batch ${i + 1} failed, trying individual emails:`, batchError);

        // Try sending individually if batch fails
        for (const email of batch) {
          try {
            const individualMsg = {
              to: email,
              from,
              subject,
              html: htmlContent,
            };

            await sgMail.send(individualMsg);
            sentCount++;
          } catch (individualError) {
            failedCount++;
            failedEmails.push(email);
            console.error(`Failed to send to ${email}:`, individualError);
          }
        }
      }
    }

    const result = {
      success: failedCount === 0,
      totalRecipients: validEmails.length,
      sentCount,
      failedCount,
      failedEmails,
    };

    console.log(`Bulk email completed: ${sentCount} sent, ${failedCount} failed`);

    return result;
  } catch (error) {
    console.error('Bulk email utility failed:', error);
    throw new InternalServerError(
      `Failed to send bulk email: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};

export const sendEmailCronJob = async (
  to: string,
  username: string,
  tier_name: string,
  updated_at: string,
) => {
  try {
    const emailTemplate = await emailTemplateRepository.getEmailTemplateByType(
      emailType.MEMBERSHIP_CHANGE,
    );
    if (!emailTemplate) {
      return false;
    }
    const rendered = renderTemplate(emailTemplate.content, { username, tier_name, updated_at });
    const html = `\`${rendered}\``;
    const msg = {
      to,
      from: process.env.SENDER_EMAIL || 'tribui.it.work@gmail.com',
      subject: 'Your FIORA Membership Tier Has Changed!',
      html,
    };

    // await sgMail.send(msg);
    return true;
  } catch (error) {
    console.error('Failed to send email', error);
    return false;
  }
};

const renderTemplate = (content: string, data: Record<string, string>) => {
  let out = content.replace(/\{\{\s*(\w+)\s*\}\}/g, (_m, k) => data[k] ?? '');
  out = out.replace(/\$\{\s*(\w+)\s*\}/g, (_m, k) => data[k] ?? '');
  return out;
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
