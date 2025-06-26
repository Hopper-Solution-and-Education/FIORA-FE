import { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';

import { faqsImportUseCase } from '@/features/faqs/di/container';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { Messages } from '@/shared/constants/message';
import { createError, createResponse } from '@/shared/lib/responseUtils/createResponse';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { FaqsRowValidated } from '@/features/faqs/domain/entities/models/faqs';
import { FAQS_VALIDATION_SCHEMAS } from '@/features/faqs/domain/schemas/faqsValidationSchemas';

// Create import-specific validation schema based on standardized schemas
const createImportValidationSchema = () => {
  const importSchemas = { ...FAQS_VALIDATION_SCHEMAS };

  // For import, url and typeOfUrl should be optional (not required)
  // The base schemas already handle this correctly with conditional validation

  return yup.object(importSchemas);
};

// Validation schema for import request using standardized schemas
const importBatchSchema = yup
  .array(createImportValidationSchema())
  .min(1, 'At least one valid record is required')
  .max(1000, 'Cannot import more than 1000 records at once')
  .required('Valid records array is required');

export default withAuthorization({
  POST: ['User', 'Admin', 'CS'],
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

async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    // Extract and validate request data
    const validRecords =
      req.body.validRecords?.map((record: FaqsRowValidated) => record?.rowData) || [];

    // Validate using standardized schemas
    try {
      await importBatchSchema.validate(validRecords, { abortEarly: false });
    } catch (validationError: any) {
      console.error('Import validation error:', validationError);

      const errorMessages = validationError.errors || ['Invalid request data'];
      return res
        .status(RESPONSE_CODE.BAD_REQUEST)
        .json(createError(res, RESPONSE_CODE.BAD_REQUEST, errorMessages.join('; ')));
    }

    // Execute import use case
    const result = await faqsImportUseCase.importFaqs(validRecords, userId);

    // Log completion for monitoring
    console.log(
      `FAQ import completed for user ${userId}: ${result.successful}/${result.totalProcessed} successful`,
      { userId, result },
    );

    // Return appropriate response based on results
    const hasFailures = result.failed > 0;
    const statusCode = hasFailures ? RESPONSE_CODE.PARTIAL_CONTENT : RESPONSE_CODE.OK;
    const message = hasFailures
      ? `Import completed with ${result.failed} failures out of ${result.totalProcessed} records`
      : 'Import completed successfully';

    return res.status(statusCode).json(createResponse(statusCode, message, result));
  } catch (error: any) {
    console.error('FAQ import error for user', userId, ':', {
      error: error.message,
      stack: error.stack,
      userId,
    });

    // Determine appropriate error response
    const { statusCode, errorMessage } = getImportErrorResponse(error);

    return res.status(statusCode).json(createError(res, statusCode, errorMessage));
  }
}

/**
 * Determine appropriate error response based on error type
 */
function getImportErrorResponse(error: any): { statusCode: number; errorMessage: string } {
  // Handle specific database constraint errors
  if (error.message?.includes('Foreign key constraint')) {
    return {
      statusCode: RESPONSE_CODE.BAD_REQUEST,
      errorMessage:
        'Invalid reference data in import records. Please check category and type values.',
    };
  }

  // Handle transaction failures
  if (error.message?.includes('Transaction')) {
    return {
      statusCode: RESPONSE_CODE.INTERNAL_SERVER_ERROR,
      errorMessage: 'Import transaction failed. No records were imported.',
    };
  }

  // Handle validation errors that escaped earlier validation
  if (error.name === 'ValidationError') {
    return {
      statusCode: RESPONSE_CODE.BAD_REQUEST,
      errorMessage: `Validation error: ${error.message}`,
    };
  }

  // Handle custom application errors
  if (error.status && error.message) {
    return {
      statusCode: error.status,
      errorMessage: error.message,
    };
  }

  // Default fallback
  return {
    statusCode: RESPONSE_CODE.INTERNAL_SERVER_ERROR,
    errorMessage: 'Import failed',
  };
}
