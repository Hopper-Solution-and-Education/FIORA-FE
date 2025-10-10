import { bankAccountRepository } from '@/features/setting/api/infrastructure/repositories/bankAccountRepository';
import { eKycRepository } from '@/features/setting/api/infrastructure/repositories/eKycRepository';
import { identificationRepository } from '@/features/setting/api/infrastructure/repositories/indentificationRepository';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { UserRole } from '@/shared/constants/userRole';
import { createErrorResponse } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { validateBody } from '@/shared/utils/validate';
import { verifyEKYCSchema } from '@/shared/validators/eKycValicator';
import { KYCStatus, KYCType } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export const maxDuration = 30; // 30 seconds

const rolePermissions = {
  PATCH: [UserRole.ADMIN, UserRole.CS],
};

export default withAuthorization(rolePermissions)(
  (req: NextApiRequest, res: NextApiResponse, sessionUserId: string) =>
    errorHandler(
      async (request, response) => {
        switch (request.method) {
          case 'PATCH':
            return PATCH(request, response, sessionUserId);
          default:
            return response
              .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
              .json({ error: Messages.METHOD_NOT_ALLOWED });
        }
      },
      req,
      res,
    ),
);

export async function PATCH(req: NextApiRequest, res: NextApiResponse, sessionUserId: string) {
  const { kycId } = req.query;
  const { error } = validateBody(verifyEKYCSchema, req.body);

  if (error) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, error));
  }

  if (!kycId || typeof kycId !== 'string') {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, 'KYC ID is required'));
  }

  const { status, remarks } = req.body;

  // Get eKYC record
  const eKYCRecord = await eKycRepository.getById(kycId);

  if (!eKYCRecord) {
    return res
      .status(RESPONSE_CODE.NOT_FOUND)
      .json(createErrorResponse(RESPONSE_CODE.NOT_FOUND, Messages.KYC_NOT_FOUND));
  }

  try {
    let result;

    // Handle based on eKYC type
    switch (eKYCRecord.type) {
      case KYCType.IDENTIFICATION:
      case KYCType.TAX:
        if (!eKYCRecord.refId) {
          return res
            .status(RESPONSE_CODE.BAD_REQUEST)
            .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, 'Reference ID not found'));
        }
        result = await identificationRepository.verify(
          {
            kycId: kycId,
            remarks: remarks || '',
            status: status as KYCStatus,
          },
          eKYCRecord.refId,
          sessionUserId,
        );
        break;

      case KYCType.BANK:
        if (!eKYCRecord.refId) {
          return res
            .status(RESPONSE_CODE.BAD_REQUEST)
            .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, 'Reference ID not found'));
        }
        result = await bankAccountRepository.verify(
          {
            kycId: kycId,
            remarks: remarks || '',
            status: status as KYCStatus,
          },
          eKYCRecord.refId,
          sessionUserId,
        );
        break;

      case KYCType.CONTACT:
        // Contact information doesn't have a refId, just update eKYC status
        result = await eKycRepository.updateStatus(kycId, status as KYCStatus, sessionUserId);
        break;

      default:
        return res
          .status(RESPONSE_CODE.BAD_REQUEST)
          .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, 'Invalid eKYC type'));
    }

    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, Messages.VERIFY_SUCCESS, result));
  } catch (error) {
    console.error('Error verifying eKYC:', error);
    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(createErrorResponse(RESPONSE_CODE.INTERNAL_SERVER_ERROR, 'Failed to verify eKYC'));
  }
}
