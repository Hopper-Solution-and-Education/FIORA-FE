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
        case 'PUT':
          return PUT(request, response, userId);
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

export async function PUT(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { id } = req.query;
  const { name, type } = req.body || {};
  if (!id) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.ID_REQUIRE));
  }

  const exists = await emailTemplateRepository.findEmailTemplateFieldById(String(id));
  if (!exists) {
    return res
      .status(RESPONSE_CODE.NOT_FOUND)
      .json(createErrorResponse(RESPONSE_CODE.NOT_FOUND, Messages.EMAIL_TEMPLATE_NOT_FOUND));
  }

  const updated = await emailTemplateRepository.updateEmailTemplateField(String(id), {
    name,
    type,
    updatedBy: userId,
    updatedAt: new Date(),
  });

  return res
    .status(RESPONSE_CODE.OK)
    .json(createResponse(RESPONSE_CODE.OK, Messages.UPDATE_SUCCESS, updated));
}

export async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.ID_REQUIRE));
  }

  const exists = await emailTemplateRepository.findEmailTemplateFieldById(String(id));
  if (!exists) {
    return res
      .status(RESPONSE_CODE.NOT_FOUND)
      .json(createErrorResponse(RESPONSE_CODE.NOT_FOUND, Messages.EMAIL_TEMPLATE_NOT_FOUND));
  }

  await emailTemplateRepository.deleteEmailTemplateField(String(id));
  return res
    .status(RESPONSE_CODE.OK)
    .json(createResponse(RESPONSE_CODE.OK, Messages.DELETE_SUCCESS));
}
