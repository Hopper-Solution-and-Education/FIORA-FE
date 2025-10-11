import sgMail from '@sendgrid/mail';
import fs from 'fs/promises';
import path from 'path';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const EMAIL_FROM_ADDRESS = process.env.SENDER_EMAIL;
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || 'FIORA';

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
} else {
  console.warn('SENDGRID_API_KEY is not set. Email functionality will be disabled.');
}

interface KYCEmailData {
  user_name: string;
  user_email: string;
  field_name: string;
  kyc_status: string;
  kyc_id: string;
  created_at: string;
  updated_at: string;
  verified_by: string;
  remarks?: string;
  document_number?: string;
  bank_account_number?: string;
}

const getKYCApprovedEmailHtml = async (data: KYCEmailData): Promise<string> => {
  try {
    const templatePath = path.join(
      process.cwd(),
      'src',
      'features',
      'profile',
      'domain',
      'templates',
      'kyc-approved.html',
    );
    let html = await fs.readFile(templatePath, 'utf-8');

    // Replace placeholders
    html = html.replace(/{{user_name}}/g, data.user_name);
    html = html.replace(/{{user_email}}/g, data.user_email);
    html = html.replace(/{{field_name}}/g, data.field_name);
    html = html.replace(/{{kyc_status}}/g, data.kyc_status);
    html = html.replace(/{{created_at}}/g, data.created_at);
    html = html.replace(/{{updated_at}}/g, data.updated_at);
    html = html.replace(/{{verified_by}}/g, data.verified_by);

    return html;
  } catch (error) {
    console.error('Error loading KYC approved email template:', error);
    throw new Error('Could not generate email content.');
  }
};

const getKYCRejectedEmailHtml = async (data: KYCEmailData): Promise<string> => {
  try {
    const templatePath = path.join(
      process.cwd(),
      'src',
      'features',
      'profile',
      'domain',
      'templates',
      'kyc-rejected.html',
    );
    let html = await fs.readFile(templatePath, 'utf-8');

    // Replace placeholders - basic replacement (not using handlebars)
    html = html.replace(/{{user_name}}/g, data.user_name);
    html = html.replace(/{{user_email}}/g, data.user_email);
    html = html.replace(/{{field_name}}/g, data.field_name);
    html = html.replace(/{{kyc_status}}/g, data.kyc_status);
    html = html.replace(/{{kyc_id}}/g, data.kyc_id);
    html = html.replace(/{{submitted_date}}/g, data.created_at);
    html = html.replace(/{{verified_at}}/g, data.updated_at);
    html = html.replace(/{{verified_by}}/g, data.verified_by);

    // Handle conditional fields (simple approach without handlebars)
    if (data.document_number) {
      html = html.replace(
        /{{#if document_number}}([\s\S]*?){{\/if}}/g,
        (match, content) => content,
      );
      html = html.replace(/{{document_number}}/g, data.document_number);
    } else {
      html = html.replace(/{{#if document_number}}[\s\S]*?{{\/if}}/g, '');
    }

    if (data.bank_account_number) {
      html = html.replace(
        /{{#if bank_account_number}}([\s\S]*?){{\/if}}/g,
        (match, content) => content,
      );
      html = html.replace(/{{bank_account_number}}/g, data.bank_account_number);
    } else {
      html = html.replace(/{{#if bank_account_number}}[\s\S]*?{{\/if}}/g, '');
    }

    if (data.remarks) {
      html = html.replace(/{{#if remarks}}([\s\S]*?){{\/if}}/g, (match, content) => content);
      html = html.replace(/{{remarks}}/g, data.remarks);
    } else {
      html = html.replace(/{{#if remarks}}[\s\S]*?{{\/if}}/g, '');
    }

    return html;
  } catch (error) {
    console.error('Error loading KYC rejected email template:', error);
    throw new Error('Could not generate email content.');
  }
};

export const sendKYCApprovedEmail = async (data: KYCEmailData): Promise<void> => {
  if (!SENDGRID_API_KEY || !EMAIL_FROM_ADDRESS) {
    console.error('Email service is not configured. Skipping email send.');
    return;
  }

  try {
    const htmlContent = await getKYCApprovedEmailHtml(data);

    const msg = {
      to: data.user_email,
      from: {
        email: EMAIL_FROM_ADDRESS,
        name: EMAIL_FROM_NAME,
      },
      subject: `KYC Verification Approved - ${data.field_name}`,
      html: htmlContent,
    };

    await sgMail.send(msg);
    console.log(`KYC approved email sent to ${data.user_email}`);
  } catch (error: unknown) {
    console.error('Error sending KYC approved email:');
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const sgError = error as { response?: { body?: unknown } };
      console.error('SendGrid Error Body:', sgError.response?.body);
    } else if (error instanceof Error) {
      console.error('General Error Message:', error.message);
    } else {
      console.error('Unknown error object:', error);
    }
    throw error;
  }
};

export const sendKYCRejectedEmail = async (data: KYCEmailData): Promise<void> => {
  if (!SENDGRID_API_KEY || !EMAIL_FROM_ADDRESS) {
    console.error('Email service is not configured. Skipping email send.');
    return;
  }

  try {
    const htmlContent = await getKYCRejectedEmailHtml(data);

    const msg = {
      to: data.user_email,
      from: {
        email: EMAIL_FROM_ADDRESS,
        name: EMAIL_FROM_NAME,
      },
      subject: `KYC Verification Rejected - ${data.field_name}`,
      html: htmlContent,
    };

    await sgMail.send(msg);
    console.log(`KYC rejected email sent to ${data.user_email}`);
  } catch (error: unknown) {
    console.error('Error sending KYC rejected email:');
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const sgError = error as { response?: { body?: unknown } };
      console.error('SendGrid Error Body:', sgError.response?.body);
    } else if (error instanceof Error) {
      console.error('General Error Message:', error.message);
    } else {
      console.error('Unknown error object:', error);
    }
    throw error;
  }
};
