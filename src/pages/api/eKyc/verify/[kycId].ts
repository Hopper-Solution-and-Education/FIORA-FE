import {
  sendKYCApprovedEmail,
  sendKYCRejectedEmail,
} from '@/features/profile/infrastructure/services/kycEmailService';
import { bankAccountRepository } from '@/features/setting/api/infrastructure/repositories/bankAccountRepository';
import { eKycRepository } from '@/features/setting/api/infrastructure/repositories/eKycRepository';
import { identificationRepository } from '@/features/setting/api/infrastructure/repositories/indentificationRepository';
import { userRepository } from '@/features/setting/api/infrastructure/repositories/userRepository';
import { Messages, UserRole } from '@/shared/constants';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
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

      default:
        return res
          .status(RESPONSE_CODE.BAD_REQUEST)
          .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, 'Invalid eKYC type'));
    }

    // Send email notification to user
    try {
      if (eKYCRecord.User?.email && eKYCRecord.userId) {
        const verifierUser = await userRepository.findUserById(sessionUserId);
        const verifierName = verifierUser?.name || verifierUser?.email || 'FIORA Admin';

        const emailData = {
          user_id: eKYCRecord.userId,
          user_name: eKYCRecord.User.name || eKYCRecord.User.email,
          user_email: eKYCRecord.User.email,
          field_name: eKYCRecord.fieldName,
          kyc_status: status,
          kyc_id: kycId,
          created_at: new Date(eKYCRecord.createdAt).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          updated_at: new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          verified_by: verifierName,
          remarks: remarks || '',
          type: eKYCRecord.type,
          bank_account_number: eKYCRecord.type == KYCType.BANK ? result?.accountNumber : '',
        };

        if (status === KYCStatus.APPROVAL) {
          await sendKYCApprovedEmail(emailData);
        } else if (status === KYCStatus.REJECTED) {
          await sendKYCRejectedEmail(emailData);
        }
      }
    } catch (emailError) {
      // Log email error but don't fail the verification process
      console.error('Failed to send KYC notification email:', emailError);
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
