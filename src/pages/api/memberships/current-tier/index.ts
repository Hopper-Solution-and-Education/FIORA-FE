import { membershipSettingUseCase } from '@/features/setting/api/application/use-cases/membershipUsecase';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createError, createResponse } from '@/shared/lib/responseUtils/createResponse';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

export default withAuthorization({
  GET: ['User', 'Admin', 'CS'],
})(async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
  switch (req.method) {
    case 'GET':
      return GET(req, res, userId);
    default:
      return res
        .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
        .json({ error: Messages.METHOD_NOT_ALLOWED });
  }
});

// Fetch current membership tier
export async function GET(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const currentMembershipTier = await membershipSettingUseCase.getCurrentMembershipTier(userId);

    return res
      .status(RESPONSE_CODE.OK)
      .json(
        createResponse(
          RESPONSE_CODE.OK,
          Messages.GET_CURRENT_MEMBERSHIP_TIER_SUCCESS,
          currentMembershipTier,
        ),
      );
  } catch (error: any) {
    return createError(
      res,
      RESPONSE_CODE.INTERNAL_SERVER_ERROR,
      error.message || Messages.INTERNAL_ERROR,
    );
  }
}
