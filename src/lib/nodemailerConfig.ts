'use server';
// nodemailerConfig.ts
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const createTransporter = (): nodemailer.Transporter => {
  const smtpConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false, // Chỉ dùng trong dev
    },
  };

  const transporter = nodemailer.createTransport(smtpConfig);

  transporter.verify((error: Error | null, success: boolean) => {
    if (error) {
      console.error('SMTP configuration error:', error);
    } else {
      console.log('SMTP server is ready to send emails');
    }
  });

  return transporter;
};

export default createTransporter();
