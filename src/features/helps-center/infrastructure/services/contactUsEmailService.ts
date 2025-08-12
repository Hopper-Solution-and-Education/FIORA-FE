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

interface ContactUsEmailData {
  to: string;
  adminName: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  attachments?: File[];
}

const getContactUsEmailHtml = async (data: ContactUsEmailData): Promise<string> => {
  try {
    const templatePath = path.join(
      process.cwd(), // Root of the project
      'src',
      'features',
      'helps-center',
      'infrastructure',
      'emailTemplates',
      'contactUsEmail.html',
    );
    let html = await fs.readFile(templatePath, 'utf-8');

    html = html.replace(/\[AdminName\]/g, data.adminName);
    html = html.replace(/\[Name\]/g, data.name);
    html = html.replace(/\[Email\]/g, data.email);
    html = html.replace(/\[Phone\]/g, data.phone);
    html = html.replace(/\[Message\]/g, data.message);

    return html;
  } catch (error) {
    console.error('Error reading or populating email template:', error);
    throw new Error('Could not generate email content.');
  }
};

export const sendContactUsEmail = async (data: ContactUsEmailData): Promise<void> => {
  if (!SENDGRID_API_KEY || !EMAIL_FROM_ADDRESS) {
    console.error('Email service is not configured. Skipping email send.');
    return;
  }

  try {
    const htmlContent = await getContactUsEmailHtml(data);

    // Process attachments asynchronously
    const attachments = data.attachments
      ? await Promise.all(
          data.attachments.map(async (attachment) => {
            const arrayBuffer = await attachment.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            return {
              content: buffer.toString('base64'),
              filename: attachment.name,
              type: attachment.type,
              disposition: 'attachment',
            };
          }),
        )
      : undefined;

    const msg = {
      to: data.to,
      from: {
        email: EMAIL_FROM_ADDRESS,
        name: EMAIL_FROM_NAME,
      },
      subject: `New contact request`,
      html: htmlContent,
      attachments,
    };

    await sgMail.send(msg);
    console.log(`Contact us email sent to ${data.to}`);
  } catch (error: unknown) {
    console.error('Error sending contact us email:');
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const sgError = error as { response?: { body?: any } };
      console.error('SendGrid Error Body:', sgError.response?.body);
    } else if (error instanceof Error) {
      console.error('General Error Message:', error.message);
    } else {
      console.error('Unknown error object:', error);
    }
  }
};
