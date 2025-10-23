import { membershipBenefitService } from '@/features/setting/api/application/use-cases/membershipBenefitUsecase';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createErrorResponse, errorHandler } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { MembershipBenefitCreatePayload } from '@/shared/types/membership-benefit';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { validateBody } from '@/shared/utils/validate';
import { membershipBenefitCreateSchema } from '@/shared/validators/memBenefitValidation';
import { NextApiRequest, NextApiResponse } from 'next';

export const maxDuration = 30;

export default withAuthorization({
  POST: ['Admin'],
  DELETE: ['Admin'],
})(async (req: NextApiRequest, res: NextApiResponse, userId: string) =>
  errorHandler(
    async (request, response) => {
      switch (request.method) {
        case 'POST':
          return POST(request, response, userId);
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

async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const payload = req.body as MembershipBenefitCreatePayload;
  const { error } = validateBody(membershipBenefitCreateSchema, req.body);
  if (error) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, error));
  }
  const newBenefit = await membershipBenefitService.processMembershipBenefit(payload, userId);

  return res
    .status(RESPONSE_CODE.CREATED)
    .json(createResponse(RESPONSE_CODE.CREATED, newBenefit.message, newBenefit.data));
}

async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(RESPONSE_CODE.BAD_REQUEST).json({ error: 'Missing or invalid ID' });
  }

  const deleted = await membershipBenefitService.delete(id);

  return res
    .status(RESPONSE_CODE.OK)
    .json(createResponse(RESPONSE_CODE.OK, 'Deleted successfully', deleted));
}
