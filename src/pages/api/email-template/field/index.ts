import { emailTemplateRepository } from '@/features/setting/api/infrastructure/repositories/emailTemplateRepository';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { Messages } from '@/shared/constants/message';
import { createErrorResponse, errorHandler } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

export const maxDuration = 30; // 30 seconds

export default sessionWrapper((req: NextApiRequest, res: NextApiResponse, userId: string) =>
  errorHandler(
    async (request, response) => {
      switch (request.method) {
        case 'GET':
          return GET(response);
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

export async function GET(res: NextApiResponse) {
  const emailTemplateFields = await emailTemplateRepository.getEmailTemplateField();

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');

  return res
    .status(RESPONSE_CODE.OK)
    .json(createResponse(RESPONSE_CODE.OK, Messages.GET_SUCCESS, emailTemplateFields));
}

export async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { name, type } = req.body || {};
  if (!name || !type) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.MISSING_PARAMS_INPUT));
  }

  const duplicated = await emailTemplateRepository.findEmailTemplateFieldByTypeAndName(type, name);
  if (duplicated) {
    return res
      .status(RESPONSE_CODE.CONFLICT)
      .json(createErrorResponse(RESPONSE_CODE.CONFLICT, Messages.UPDATE_FAIL));
  }

  const created = await emailTemplateRepository.createEmailTemplateField({
    id: crypto.randomUUID(),
    name,
    type,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: userId,
    updatedBy: userId,
  });

  return res
    .status(RESPONSE_CODE.CREATED)
    .json(createResponse(RESPONSE_CODE.CREATED, Messages.SEND_SUCCESS, created));
}
