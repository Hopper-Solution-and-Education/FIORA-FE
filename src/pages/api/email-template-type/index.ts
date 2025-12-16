import { emailTemplateRepository } from '@/features/setting/api/infrastructure/repositories/emailTemplateRepository';
import { Messages } from '@/shared/constants';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

export const maxDuration = 30; // 30 seconds

export default withAuthorization({
  GET: ['Admin', 'CS'],
})((request: NextApiRequest, response: NextApiResponse) => {
  switch (request.method) {
    case 'GET':
      return GET(response);
    default:
      return response
        .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
        .json({ error: Messages.METHOD_NOT_ALLOWED });
  }
});

export async function GET(res: NextApiResponse) {
  const emailTemplates = await emailTemplateRepository.getEmailTemplateType();

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');

  return res
    .status(RESPONSE_CODE.OK)
    .json(createResponse(RESPONSE_CODE.OK, Messages.GET_EMAIL_TEMPLATE_SUCCESS, emailTemplates));
}
