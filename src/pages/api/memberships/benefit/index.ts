import { membershipBenefitService } from '@/features/setting/api/application/use-cases/membershipBenefitUsecase';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createErrorResponse } from '@/shared/lib';
import { createError, createResponse } from '@/shared/lib/responseUtils/createResponse';
import { MembershipBenefitCreatePayload } from '@/shared/types/membership-benefit';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { validateBody } from '@/shared/utils/validate';
import { membershipBenefitCreateSchema } from '@/shared/validators/memBenefitValidation';
import { NextApiRequest, NextApiResponse } from 'next';

export const maxDuration = 30;

export default withAuthorization({
  POST: ['Admin'],
  PUT: ['Admin'],
})(async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
  switch (req.method) {
    case 'POST':
      return createMembershipBenefit(req, res, userId);
    case 'DELETE':
      return deleteMembershipBenefit(req, res);
    default:
      return res.status(RESPONSE_CODE.METHOD_NOT_ALLOWED).json({
        error: Messages.METHOD_NOT_ALLOWED,
      });
  }
});

async function createMembershipBenefit(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const payload = req.body as MembershipBenefitCreatePayload;
    const { error } = validateBody(membershipBenefitCreateSchema, req.body);
    if (error) {
      return res
        .status(RESPONSE_CODE.BAD_REQUEST)
        .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, error));
    }
    const newBenefit = await membershipBenefitService.create(payload, userId);

    return res
      .status(RESPONSE_CODE.CREATED)
      .json(createResponse(RESPONSE_CODE.CREATED, 'Created successfully', newBenefit));
  } catch (error) {
    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(
        createError(
          res,
          RESPONSE_CODE.INTERNAL_SERVER_ERROR,
          error instanceof Error ? error.message : Messages.INTERNAL_ERROR,
        ),
      );
  }
}

async function deleteMembershipBenefit(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(RESPONSE_CODE.BAD_REQUEST).json({ error: 'Missing or invalid ID' });
    }

    const deleted = await membershipBenefitService.delete(id);

    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, 'Deleted successfully', deleted));
  } catch (error) {
    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(
        createError(
          res,
          RESPONSE_CODE.INTERNAL_SERVER_ERROR,
          error instanceof Error ? error.message : Messages.INTERNAL_ERROR,
        ),
      );
  }
}
