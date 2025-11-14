import { userRepository } from '@/features/auth/infrastructure/repositories/userRepository';
import { eKycRepository } from '@/features/setting/api/infrastructure/repositories/eKycRepository';
import { identificationRepository } from '@/features/setting/api/infrastructure/repositories/indentificationRepository';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { Messages } from '@/shared/constants/message';
import { UserRole } from '@/shared/constants/userRole';
import { createErrorResponse } from '@/shared/lib';
import { createError, createResponse } from '@/shared/lib/responseUtils/createResponse';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { validateBody } from '@/shared/utils/validate';
import { editIdentificationSchema } from '@/shared/validators/identificationValidator';
import { NextApiRequest, NextApiResponse } from 'next';

export const maxDuration = 30; // 30 seconds

export default sessionWrapper((req: NextApiRequest, res: NextApiResponse, userId: string) =>
  errorHandler(
    async (request, response) => {
      switch (request.method) {
        case 'PATCH':
          return PATCH(request, response, userId);
        case 'DELETE':
          return DELETE(request, response);
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

export async function PATCH(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const user = await userRepository.findById(userId);

  if (!user || !user.role || (user.role !== UserRole.ADMIN && user.role !== UserRole.CS)) {
    return res
      .status(RESPONSE_CODE.FORBIDDEN)
      .json(
        createError(
          res,
          RESPONSE_CODE.FORBIDDEN,
          'You do not have permission to update this document',
        ),
      );
  }

  const { id } = req.query;
  const { error } = validateBody(editIdentificationSchema, req.body);
  if (error) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, error));
  }
  const { kycId, remarks, status } = req.body;
  const checkIdentify = await identificationRepository.getById(String(id));
  if (!checkIdentify) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.NOT_FOUND, Messages.BANK_ACCOUNT_NOT_FOUND, error));
  }

  const checkKyc = await eKycRepository.getById(kycId);
  if (!checkKyc) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.NOT_FOUND, Messages.KYC_NOT_FOUND, error));
  }
  if (checkKyc.refId != id) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.CONFLICT, Messages.KYC_NOT_MATCH, error));
  }
  delete req.body.kycId;
  const newIdentification = await identificationRepository.verify(
    {
      kycId,
      remarks,
      status,
    },
    String(id),
    userId,
  );
  return res
    .status(RESPONSE_CODE.CREATED)
    .json(
      createResponse(
        RESPONSE_CODE.CREATED,
        Messages.VERIFY_IDENTIFICATION_SUCCESS,
        newIdentification,
      ),
    );
}

export async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  await identificationRepository.delete(String(id));
  return res
    .status(RESPONSE_CODE.CREATED)
    .json(createResponse(RESPONSE_CODE.CREATED, Messages.DELETE_SUCCESS, null));
}
