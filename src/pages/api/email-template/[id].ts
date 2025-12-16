import { emailTemplateRepository } from '@/features/setting/api/infrastructure/repositories/emailTemplateRepository';
import { Messages } from '@/shared/constants';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createErrorResponse } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { validateBody } from '@/shared/utils/validate';
import { editEmailTemplateDto } from '@/shared/validators/emailTemplateValidation';
import { NextApiRequest, NextApiResponse } from 'next';

export const maxDuration = 30; // 30 seconds

export default withAuthorization({
  PUT: ['Admin', 'CS'],
  DELETE: ['Admin', 'CS'],
})((request: NextApiRequest, response: NextApiResponse, userId: string) => {
  switch (request.method) {
    case 'PUT':
      return PUT(request, response, userId);
    case 'DELETE':
      return DELETE(request, response);
    default:
      return response
        .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
        .json({ error: Messages.METHOD_NOT_ALLOWED });
  }
});
export async function PUT(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { isActive, content, name } = req.body;
  const { id } = req.query;

  const { error } = validateBody(editEmailTemplateDto, req.body);
  if (error) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, error));
  }

  const checkTemplate = await emailTemplateRepository.findEmailTemplateById(String(id));
  if (!checkTemplate) {
    return res
      .status(RESPONSE_CODE.CONFLICT)
      .json(createErrorResponse(RESPONSE_CODE.NOT_FOUND, Messages.EMAIL_TEMPLATE_NOT_FOUND));
  }

  if (isActive) {
    const checkTemplateDefault = await emailTemplateRepository.checkTemplateDefault();
    if (checkTemplateDefault) {
      return res
        .status(RESPONSE_CODE.CONFLICT)
        .json(createErrorResponse(RESPONSE_CODE.CONFLICT, Messages.EMAIL_TEMPLATE_DEFAULT_EXIT));
    }
  }
  const updatedCategory = await emailTemplateRepository.updateEmailTemplate(String(id), userId, {
    ...checkTemplate,
    name: name,
    content: content,
    isActive: isActive,
    updatedBy: userId,
    updatedAt: new Date(),
  });
  return res
    .status(RESPONSE_CODE.OK)
    .json(createResponse(RESPONSE_CODE.OK, Messages.UPDATE_CATEGORY_SUCCESS, updatedCategory));
}

async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    if (!id) {
      return res
        .status(RESPONSE_CODE.NOT_FOUND)
        .json(createErrorResponse(RESPONSE_CODE.NOT_FOUND, Messages.ID_REQUIRE));
    }
    const emailTemplate = await emailTemplateRepository.findEmailTemplateById(id?.toString() || '');

    if (emailTemplate?.isdefault) {
      return res
        .status(RESPONSE_CODE.CONFLICT)
        .json(createErrorResponse(RESPONSE_CODE.CONFLICT, Messages.NOT_DELETE_TEMPLATE));
    }
    await emailTemplateRepository.delete(id?.toString() || '');
    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, Messages.DELETE_EMAIL_TEMPLATE_SUCCESS));
  } catch (error: any) {
    if (error.message === Messages.COMMENT_NOT_FOUND) {
      return res
        .status(RESPONSE_CODE.NOT_FOUND)
        .json(createErrorResponse(RESPONSE_CODE.NOT_FOUND, Messages.EMAIL_TEMPLATE_NOT_FOUND));
    }
    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(
        createErrorResponse(
          RESPONSE_CODE.INTERNAL_SERVER_ERROR,
          Messages.INTERNAL_ERROR || error.message,
        ),
      );
  }
}
