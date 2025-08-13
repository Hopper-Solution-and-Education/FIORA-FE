import { emailTemplateRepository } from '@/features/setting/api/infrastructure/repositories/emailTemplateRepository';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { Messages } from '@/shared/constants/message';
import { createErrorResponse } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { validateBody } from '@/shared/utils/validate';
import { createEmailTemplateDto } from '@/shared/validators/emailTemplateValidation';
import { NextApiRequest, NextApiResponse } from 'next';

export const maxDuration = 30; // 30 seconds

export default withAuthorization({
  GET: ['Admin', 'CS'],
  POST: ['Admin', 'CS'],
})((request: NextApiRequest, response: NextApiResponse, userId: string) => {
  switch (request.method) {
    case 'POST':
      return POST(request, response, userId);
    case 'GET':
      return GET(response);
    default:
      return response
        .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
        .json({ error: Messages.METHOD_NOT_ALLOWED });
  }
});

export async function GET(res: NextApiResponse) {
  const emailTemplates = await emailTemplateRepository.getEmailTemplate();

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');

  return res
    .status(RESPONSE_CODE.OK)
    .json(createResponse(RESPONSE_CODE.OK, Messages.GET_EMAIL_TEMPLATE_SUCCESS, emailTemplates));
}

export async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { error } = validateBody(createEmailTemplateDto, req.body);
  if (error) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, error));
  }
  const { type, name } = req.body;

  const existingTemplateType = await emailTemplateRepository.checkTemplateType(type);
  if (!existingTemplateType) {
    return res
      .status(RESPONSE_CODE.CONFLICT)
      .json(createErrorResponse(RESPONSE_CODE.CONFLICT, Messages.EMAIL_TEMPLATE_TYPE_NOT_FOUND));
  }

  const existingTemplate = await emailTemplateRepository.findEmailTemplateByTypeOrName(type, name);
  if (existingTemplate) {
    return res
      .status(RESPONSE_CODE.CONFLICT)
      .json(createErrorResponse(RESPONSE_CODE.CONFLICT, Messages.DUPLICATE_EMAIL_TEMPLATE));
  }
  delete req.body.type;

  const newEmailTemplate = await emailTemplateRepository.createEmailTemplate({
    ...req.body,
    emailtemplatetypeid: type,
    isActive: true,
    createdBy: userId,
    updatedBy: userId,
    createdAt: new Date(),
    updatedAt: new Date(),
    id: crypto.randomUUID(),
  });
  return res
    .status(RESPONSE_CODE.CREATED)
    .json(
      createResponse(
        RESPONSE_CODE.CREATED,
        Messages.CREATE_EMAIL_TEMPLATE_SUCCESS,
        newEmailTemplate,
      ),
    );
}
