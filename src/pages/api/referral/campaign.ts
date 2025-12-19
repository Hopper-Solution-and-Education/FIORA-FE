import { referralUseCase } from '@/features/referral/application/use-cases/referralUseCase';
import { Messages } from '@/shared/constants';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createErrorResponse, createResponse } from '@/shared/lib';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { validateBody } from '@/shared/utils/validate';
import { campaignUpsertSchema } from '@/shared/validators/commonSettingValidation';
import { NextApiRequest, NextApiResponse } from 'next';

export default withAuthorization({
  GET: ['Admin'],
  POST: ['Admin'],
})((req: NextApiRequest, res: NextApiResponse, userId: string) =>
  errorHandler(
    async (request, response) => {
      switch (request.method) {
        case 'GET':
          return GET(request, response);
        case 'POST':
          return POST(request, response, userId);
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

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const referralCampaign = await referralUseCase.getCampaign();

  return res
    .status(RESPONSE_CODE.OK)
    .json(
      createResponse(
        RESPONSE_CODE.OK,
        'OK',
        referralCampaign,
        Messages.REFERRAL_CAMPAIGN_GET_SUCCESS,
      ),
    );
}

export async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { dynamicValue } = req.body;

  // Validate that dynamicValue exists
  if (!dynamicValue) {
    return res.status(RESPONSE_CODE.BAD_REQUEST).json(
      createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, {
        dynamicValue: Messages.REFERRAL_CAMPAIGN_FORM_INVALID,
      }),
    );
  }

  const { bonus_1st_amount, minimumWithdrawal, isActive } = dynamicValue as any;

  const payload = {
    bonus_1st_amount,
    minimumWithdrawal,
    isActive,
  };

  // Validate payload
  const { error } = validateBody(campaignUpsertSchema, payload);
  if (error) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, error));
  }

  const referralCampaign = await referralUseCase.upsertCampaign(userId, payload);

  return res
    .status(RESPONSE_CODE.OK)
    .json(
      createResponse(
        RESPONSE_CODE.OK,
        'OK',
        referralCampaign,
        Messages.REFERRAL_CAMPAIGN_UPSERT_SUCCESS,
      ),
    );
}
