import { eKycRepository } from '@/features/setting/api/infrastructure/repositories/eKycRepository';
import { identificationRepository } from '@/features/setting/api/infrastructure/repositories/indentificationRepository';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { Messages } from '@/shared/constants/message';
import { createErrorResponse } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { validateBody } from '@/shared/utils/validate';
import { editIdentificationSchema } from '@/shared/validators/identificationValidator';
import { NextApiRequest, NextApiResponse } from 'next';

export const maxDuration = 30; // 30 seconds

export default sessionWrapper(async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
  switch (req.method) {
    case 'PATCH':
      return PATCH(req, res, userId);
    default:
      return res
        .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
        .json({ error: Messages.METHOD_NOT_ALLOWED });
  }
});

export async function PATCH(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { id } = req.query;
    const { error } = validateBody(editIdentificationSchema, req.body);
    if (error) {
      return res
        .status(RESPONSE_CODE.BAD_REQUEST)
        .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, error));
    }
    const { kycId, remarks, status } = req.body;
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
      id,
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
  } catch (error: any) {
    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(createResponse(RESPONSE_CODE.INTERNAL_SERVER_ERROR, error || Messages.INTERNAL_ERROR));
  }
}
