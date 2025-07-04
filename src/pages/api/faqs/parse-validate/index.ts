import fs from 'fs/promises';
import { NextApiRequest, NextApiResponse } from 'next';
import os from 'os';
import path from 'path';
import formidable from 'formidable';

import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { Messages } from '@/shared/constants/message';
import { createError, createResponse } from '@/shared/lib/responseUtils/createResponse';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { faqsImportUseCase } from '@/features/faqs/di/container';
import { FAQ_IMPORT_CONSTANTS } from '@/features/faqs/constants';

export const config = {
  api: {
    bodyParser: false, // Disable default body parser for file uploads
  },
};

export default withAuthorization({
  POST: ['Admin', 'CS'],
})(async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
  switch (req.method) {
    case 'POST':
      return POST(req, res, userId);
    default:
      return res
        .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
        .json({ error: Messages.METHOD_NOT_ALLOWED });
  }
});

/**
 * Validate file type and size
 */
function validateFile(uploadedFile: formidable.File): { isValid: boolean; error?: string } {
  const fileName = uploadedFile.originalFilename || '';
  const fileExtension = path.extname(fileName).toLowerCase();
  const allowedExtensions = ['.xlsx', '.csv'];

  // Check file type
  if (!allowedExtensions.includes(fileExtension)) {
    return {
      isValid: false,
      error: `Unsupported file type. Please upload ${allowedExtensions.join(' or ')} files`,
    };
  }

  // Check file size
  if (uploadedFile.size > FAQ_IMPORT_CONSTANTS.MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File too large. Maximum size allowed: ${FAQ_IMPORT_CONSTANTS.MAX_FILE_SIZE / (1024 * 1024)}MB`,
    };
  }

  return { isValid: true };
}

/**
 * Parse and validate maxRecords parameter
 */
function parseMaxRecords(fields: formidable.Fields): { maxRecords: number; error?: string } {
  const maxRecordsField = Array.isArray(fields.maxRecords)
    ? fields.maxRecords[0]
    : fields.maxRecords;

  const maxRecords = maxRecordsField
    ? parseInt(maxRecordsField.toString())
    : FAQ_IMPORT_CONSTANTS.MAX_RECORDS;

  if (isNaN(maxRecords) || maxRecords <= 0 || maxRecords > FAQ_IMPORT_CONSTANTS.MAX_RECORDS) {
    return {
      maxRecords: 0,
      error: `Invalid maxRecords. Must be between 1 and ${FAQ_IMPORT_CONSTANTS.MAX_RECORDS}`,
    };
  }

  return { maxRecords };
}

/**
 * Convert uploaded file to File object for use case
 */
async function convertToFileObject(uploadedFile: formidable.File): Promise<File> {
  const fileName = uploadedFile.originalFilename || '';
  const fileExtension = path.extname(fileName).toLowerCase();
  const fileBuffer = await fs.readFile(uploadedFile.filepath);

  return new File([fileBuffer as any], fileName, {
    type:
      fileExtension === '.xlsx'
        ? FAQ_IMPORT_CONSTANTS.ALLOWED_TYPES.XLSX
        : FAQ_IMPORT_CONSTANTS.ALLOWED_TYPES.CSV,
  });
}

async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  let tempFilePath: string | null = null;

  try {
    // Create temp directory if it doesn't exist
    const tempDir = path.join(os.tmpdir(), 'faqs-uploads');
    await fs.mkdir(tempDir, { recursive: true });

    // Parse form data with formidable
    const form = formidable({
      maxFileSize: FAQ_IMPORT_CONSTANTS.MAX_FILE_SIZE,
      keepExtensions: true,
      uploadDir: tempDir,
      filename: () => `upload_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    });

    const [fields, files] = await form.parse(req);

    // Get file from the request
    const fileArray = files.file;
    const uploadedFile = Array.isArray(fileArray) ? fileArray[0] : fileArray;

    if (!uploadedFile) {
      return res
        .status(RESPONSE_CODE.BAD_REQUEST)
        .json(createError(res, RESPONSE_CODE.BAD_REQUEST, 'No file provided'));
    }

    tempFilePath = uploadedFile.filepath;

    // Validate file
    const fileValidation = validateFile(uploadedFile);
    if (!fileValidation.isValid) {
      return res
        .status(RESPONSE_CODE.BAD_REQUEST)
        .json(createError(res, RESPONSE_CODE.BAD_REQUEST, fileValidation.error!));
    }

    // Parse and validate maxRecords
    const maxRecordsResult = parseMaxRecords(fields);
    if (maxRecordsResult.error) {
      return res
        .status(RESPONSE_CODE.BAD_REQUEST)
        .json(createError(res, RESPONSE_CODE.BAD_REQUEST, maxRecordsResult.error));
    }

    // Convert to File object for use case
    const fileObject = await convertToFileObject(uploadedFile);

    // Execute validation use case - all the business logic is here now
    const result = await faqsImportUseCase.validateFaqsImportFile({
      file: fileObject,
      maxRecords: maxRecordsResult.maxRecords,
      userId,
    });

    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, 'Validation completed successfully', result));
  } catch (error: any) {
    console.error('Parse-validate error:', error);

    let errorMessage: string = 'Validation failed';
    let statusCode = RESPONSE_CODE.INTERNAL_SERVER_ERROR;

    // Handle specific error types
    if (error.message?.includes('File contains more than')) {
      errorMessage = error.message;
      statusCode = RESPONSE_CODE.BAD_REQUEST;
    } else if (error.message?.includes('No data found')) {
      errorMessage = 'File is empty or contains no valid data';
      statusCode = RESPONSE_CODE.BAD_REQUEST;
    } else if (error.message?.includes('Failed to parse')) {
      errorMessage = 'File format is invalid or corrupted';
      statusCode = RESPONSE_CODE.BAD_REQUEST;
    } else if (error.message?.includes('ENOENT')) {
      errorMessage = 'File upload failed. Please try again.';
      statusCode = RESPONSE_CODE.INTERNAL_SERVER_ERROR;
    } else if (error.message?.includes('File too large')) {
      errorMessage = error.message;
      statusCode = RESPONSE_CODE.BAD_REQUEST;
    } else if (error.message) {
      errorMessage = error.message;
      statusCode = error.status || RESPONSE_CODE.BAD_REQUEST;
    }

    return res.status(statusCode).json(createError(res, statusCode, errorMessage));
  } finally {
    // Clean up temporary file
    if (tempFilePath) {
      try {
        await fs.unlink(tempFilePath);
      } catch (cleanupError) {
        console.warn('Failed to cleanup temp file:', tempFilePath, cleanupError);
      }
    }
  }
}
