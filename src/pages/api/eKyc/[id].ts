import { bankAccountRepository } from '@/features/setting/api/infrastructure/repositories/bankAccountRepository';
import { eKycRepository } from '@/features/setting/api/infrastructure/repositories/eKycRepository';
import { identificationRepository } from '@/features/setting/api/infrastructure/repositories/indentificationRepository';
import { Messages } from '@/shared/constants';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createErrorResponse } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { KYCType } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export const maxDuration = 30; // 30 seconds

export default sessionWrapper((req: NextApiRequest, res: NextApiResponse, userId: string) =>
  errorHandler(
    async (request, response) => {
      switch (request.method) {
        case 'DELETE':
          return DELETE(request, response, userId);
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

export async function DELETE(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, 'eKYC ID is required'));
  }

  try {
    // Get eKYC record to check ownership and type
    const eKYCRecord = await eKycRepository.getById(id);

    if (!eKYCRecord) {
      return res
        .status(RESPONSE_CODE.NOT_FOUND)
        .json(createErrorResponse(RESPONSE_CODE.NOT_FOUND, Messages.KYC_NOT_FOUND));
    }

    // Check if user owns this eKYC
    if (eKYCRecord.userId !== userId) {
      return res
        .status(RESPONSE_CODE.FORBIDDEN)
        .json(createErrorResponse(RESPONSE_CODE.FORBIDDEN, 'You do not have permission'));
    }

    // Delete related document/data based on type
    if (eKYCRecord.refId) {
      switch (eKYCRecord.type) {
        case KYCType.IDENTIFICATION:
          await identificationRepository.delete(eKYCRecord.refId);
          break;
        case KYCType.TAX:
          await identificationRepository.delete(eKYCRecord.refId);
          break;
        case KYCType.BANK:
          await bankAccountRepository.delete(eKYCRecord.refId);
          break;
        // CONTACT type doesn't have refId/related document
      }
    }

    // Delete eKYC record
    await eKycRepository.delete(id);

    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, 'eKYC deleted successfully', null));
  } catch (error) {
    console.error('Error deleting eKYC:', error);
    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(createErrorResponse(RESPONSE_CODE.INTERNAL_SERVER_ERROR, 'Failed to delete eKYC'));
  }
}
