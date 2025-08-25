import { membershipSettingUseCase } from '@/features/setting/api/application/use-cases/membershipUsecase';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { errorHandler } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { createErrorResponse } from '@/shared/lib/utils';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { validateBody } from '@/shared/utils/validate';
import { updateMembershipTierThresholdSchema } from '@/shared/validators/membershipValidator';
import { NextApiRequest, NextApiResponse } from 'next';

export const maxDuration = 30; // 30 seconds

export default withAuthorization({
  PUT: ['Admin'],
})((req: NextApiRequest, res: NextApiResponse, userId: string) =>
  errorHandler(
    async (request, response) => {
      switch (request.method) {
        case 'PUT':
          return PUT(request, response, userId);
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

export async function PUT(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { error } = validateBody(updateMembershipTierThresholdSchema, req.body);
  if (error) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, error));
  }
  const newMembershipTier = await membershipSettingUseCase.updateMembershipThreshold(
    req.body,
    userId,
  );

  return res
    .status(RESPONSE_CODE.CREATED)
    .json(
      createResponse(
        RESPONSE_CODE.CREATED,
        Messages.UPSERT_MEMBERSHIP_TIER_SUCCESS,
        newMembershipTier,
      ),
    );
}
