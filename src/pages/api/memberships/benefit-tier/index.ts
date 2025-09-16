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
  GET: ['Admin', 'User', 'CS'],
})((req: NextApiRequest, res: NextApiResponse, userId: string) =>
  errorHandler(
    async (request, response) => {
      switch (request.method) {
        case 'PUT':
          return PUT(request, response, userId);
        case 'GET':
          return GET(request, response);
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

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { limit, search, page } = req.query as {
    cursor?: string;
    limit?: string;
    search?: string;
    page?: string;
  };

  const parsedLimit = limit ? parseInt(limit, 10) : 20;

  if (parsedLimit < 1 || parsedLimit > 100) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createResponse(RESPONSE_CODE.BAD_REQUEST, 'Limit must be between 1 and 100', null));
  }
  const result = await membershipSettingUseCase.getTierInfinity({
    limit: parsedLimit,
    search,
    page,
  });

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');

  return res
    .status(RESPONSE_CODE.OK)
    .json(createResponse(RESPONSE_CODE.OK, Messages.GET_SUCCESS, result));
}
