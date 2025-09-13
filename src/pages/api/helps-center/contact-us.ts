import { contactUsUseCase } from '@/features/helps-center/application/use-cases/contact-us/contactUsUseCase';
import type { ContactUsRequest } from '@/features/helps-center/domain/entities/models/faqs';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { createErrorResponse } from '@/shared/lib/utils';
import { validateBody } from '@/shared/utils/validate';
import { contactUsSchema } from '@/shared/validators/contactUsValidator';
import formidable from 'formidable';
import fs from 'fs/promises';
import type { NextApiRequest, NextApiResponse } from 'next';
import os from 'os';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      return POST(req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Parse multipart form data
    const tempDir = path.join(os.tmpdir(), 'contact-us-uploads');
    await fs.mkdir(tempDir, { recursive: true });

    const form = formidable({
      multiples: true,
      keepExtensions: true,
      uploadDir: tempDir,
      maxFileSize: 5 * 1024 * 1024, // 5MB per file
    });

    const [fields, files] = await form.parse(req);

    // Build a plain object from fields (string)
    const payload = {
      name: Array.isArray(fields.name) ? fields.name[0] : fields.name,
      email: Array.isArray(fields.email) ? fields.email[0] : fields.email,
      phoneNumber: Array.isArray(fields.phoneNumber) ? fields.phoneNumber[0] : fields.phoneNumber,
      title: Array.isArray(fields.title) ? fields.title[0] : fields.title,
      message: Array.isArray(fields.message) ? fields.message[0] : fields.message,
    } as Record<string, any>;

    // Validate text fields only
    const { error, value } = validateBody<ContactUsRequest>(contactUsSchema, payload as any);
    if (error || !value) {
      return res
        .status(RESPONSE_CODE.BAD_REQUEST)
        .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, error));
    }

    // Convert uploaded files to Web File objects (Node 18+)
    const uploaded = files.attachments;
    let attachments: File[] | undefined = undefined;
    if (uploaded) {
      const fileArray = Array.isArray(uploaded) ? uploaded : [uploaded];
      attachments = await Promise.all(
        fileArray.map(async (f) => {
          const fileName = f.originalFilename || 'attachment';
          const fileBuffer = await fs.readFile(f.filepath);
          const fileType = f.mimetype || 'application/octet-stream';
          return new File([fileBuffer as any], fileName, { type: fileType });
        }),
      );
    }

    // Execute the contact us use case
    const result = await contactUsUseCase.execute({ ...value, attachments });

    if (!result) {
      return res
        .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        .json(createErrorResponse(RESPONSE_CODE.INTERNAL_SERVER_ERROR, Messages.INTERNAL_ERROR));
    }

    // Return success response
    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, Messages.SEND_SUCCESS, result));
  } catch (error) {
    console.error('Contact Us API Error:', error);

    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message === 'No admin user found') {
        return res
          .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
          .json(createErrorResponse(RESPONSE_CODE.INTERNAL_SERVER_ERROR, Messages.INTERNAL_ERROR));
      }
    }

    // Generic error response
    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(createErrorResponse(RESPONSE_CODE.INTERNAL_SERVER_ERROR, Messages.INTERNAL_ERROR));
  }
}
