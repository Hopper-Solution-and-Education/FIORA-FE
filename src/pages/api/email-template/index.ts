import { emailTemplateUseCase } from '@/features/setting/api/domain/use-cases/emailTemplateUsecase';
import { emailTemplateRepository } from '@/features/setting/api/infrastructure/repositories/emailTemplateRepository';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { Messages } from '@/shared/constants/message';
import { createErrorResponse } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { validateBody } from '@/shared/utils/validate';
import { emailTemplateSchema } from '@/shared/validators/emailTemplateValidation';
import { NextApiRequest, NextApiResponse } from 'next';

export const maxDuration = 30; // 30 seconds

export default withAuthorization({
  GET: ['Admin', 'CS', 'User'],
  POST: ['Admin', 'CS', 'User'],
  PUT: ['Admin', 'CS', 'User'],
  DELETE: ['Admin', 'CS', 'User'],
})((req: NextApiRequest, res: NextApiResponse, userId: string) =>
  errorHandler(
    async (request, response) => {
      switch (request.method) {
        case 'POST':
          return POST(request, response, userId);
        case 'GET':
          return GET(response);
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
  const { error } = validateBody(emailTemplateSchema, req.body);
  if (error) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, error));
  }
  const { type, name } = req.body;
  const existingTemplate = await emailTemplateRepository.findEmailTemplateByTypeOrName(type, name);
  if (existingTemplate) {
    return res
      .status(RESPONSE_CODE.CONFLICT)
      .json(createErrorResponse(RESPONSE_CODE.CONFLICT, Messages.DUPLICATE_EMAIL_TEMPLATE));
  }
  delete req.body.type;

  const newEmailTemplate = await emailTemplateRepository.createEmailTemplate(
    {
      ...req.body,
      isActive: true,
      createdBy: userId,
      updatedBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      id: crypto.randomUUID(),
    },
    type,
  );
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

export async function PUT(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { id, isActive } = req.body;

    const { error } = validateBody(emailTemplateSchema, req.body);
    if (error) {
      return res
        .status(RESPONSE_CODE.BAD_REQUEST)
        .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, error));
    }
    if (isActive) {
      const checkTemplateDefault = await emailTemplateRepository.checkTemplateDefault();
      if (checkTemplateDefault) {
        return res
          .status(RESPONSE_CODE.CONFLICT)
          .json(createErrorResponse(RESPONSE_CODE.CONFLICT, Messages.EMAIL_TEMPLATE_DEFAULT_EXIT));
      }
    }
    const updatedCategory = await emailTemplateUseCase.updateEmailTemplate(id, userId, {
      ...req.body,
      updatedBy: userId,
      updatedAt: new Date(),
    });
    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, Messages.UPDATE_CATEGORY_SUCCESS, updatedCategory));
  } catch (error: any) {
    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(createResponse(RESPONSE_CODE.INTERNAL_SERVER_ERROR, error || Messages.INTERNAL_ERROR));
  }
}

async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { emailTemplateId } = req.query;
    if (!emailTemplateId) {
      return res
        .status(RESPONSE_CODE.NOT_FOUND)
        .json(createErrorResponse(RESPONSE_CODE.NOT_FOUND, Messages.ID_REQUIRE));
    }
    const emailTemplate = await emailTemplateRepository.findEmailTemplateById(
      emailTemplateId?.toString() || '',
    );

    if (emailTemplate?.isActive) {
      return res
        .status(RESPONSE_CODE.CONFLICT)
        .json(createErrorResponse(RESPONSE_CODE.CONFLICT, Messages.NOT_DELETE_TEMPLATE));
    }
    await emailTemplateRepository.delete(emailTemplateId?.toString() || '');
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
