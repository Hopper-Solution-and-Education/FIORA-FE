import { membershipSettingUseCase } from '@/features/setting/api/application/use-cases/membershipUsecase';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createError, createResponse } from '@/shared/lib/responseUtils/createResponse';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { validateBody } from '@/shared/utils/validate';
import { membershipTierSchema } from '@/shared/validators/membershipValidator';
import { NextApiRequest, NextApiResponse } from 'next';

export default withAuthorization({
  PUT: ['Admin'],
})(async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
  switch (req.method) {
    case 'PUT':
      return PUT(req, res, userId);
    default:
      return res
        .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
        .json({ error: Messages.METHOD_NOT_ALLOWED });
  }
});

// Membership Tier Upsert
export async function PUT(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { id } = req.query;
    if (!id) {
      return res
        .status(RESPONSE_CODE.BAD_REQUEST)
        .json(createResponse(RESPONSE_CODE.BAD_REQUEST, Messages.MISSING_PARAMS_INPUT + 'id', null));
    }

    const { error } = validateBody(membershipTierSchema, req.body);
    if (error) {
      return res
        .status(RESPONSE_CODE.BAD_REQUEST)
        .json(createResponse(RESPONSE_CODE.BAD_REQUEST, error.message, error));
    }
    const newMembershipTier = await membershipSettingUseCase.upsertMembershipTier({ ...req.body, id: id as string }, userId);

    return res
      .status(RESPONSE_CODE.CREATED)
      .json(createResponse(RESPONSE_CODE.CREATED, Messages.UPSERT_MEMBERSHIP_TIER_SUCCESS, newMembershipTier));
  } catch (error: any) {
    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(
        createError(
          res,
          RESPONSE_CODE.INTERNAL_SERVER_ERROR,
          error.message || Messages.INTERNAL_ERROR,
        ),
      );
  }
}