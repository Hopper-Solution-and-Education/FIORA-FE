import { emailTemplateUseCase } from '@/features/setting/api/domain/use-cases/emailTemplateUsecase';
import { emailTemplateRepository } from '@/features/setting/api/infrastructure/repositories/emailTemplateRepository';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { Messages } from '@/shared/constants/message';
import { createErrorResponse } from '@/shared/lib';
import { createError, createResponse } from '@/shared/lib/responseUtils/createResponse';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { validateBody } from '@/shared/utils/validate';
import { emailTemplateSchema } from '@/shared/validators/emailTemplateValidation';
import { NextApiRequest, NextApiResponse } from 'next';

export const maxDuration = 30; // 30 seconds

export default withAuthorization({
  GET: ['Admin', 'CS'],
  POST: ['Admin', 'CS'],
  PUT: ['Admin', 'CS'],
  DELETE: ['Admin', 'CS'],
})(async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
  switch (req.method) {
    case 'POST':
      return POST(req, res, userId);
    case 'GET':
      return GET(res);
    case 'PUT':
      return PUT(req, res, userId);
    case 'DELETE':
      return DELETE(req, res);
    default:
      return res
        .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
        .json({ error: Messages.METHOD_NOT_ALLOWED });
  }
});

export async function GET(res: NextApiResponse) {
  try {
    const emailTemplates = await emailTemplateRepository.getEmailTemplate();

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');

    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, Messages.GET_EMAIL_TEMPLATE_SUCCESS, emailTemplates));
  } catch (error: any) {
    res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(
        createError(
          res,
          RESPONSE_CODE.INTERNAL_SERVER_ERROR,
          error.message || Messages.INTERNAL_ERROR,
        ),
      );
  }
}

export async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { error } = validateBody(emailTemplateSchema, req.body);
    if (error) {
      return res
        .status(RESPONSE_CODE.BAD_REQUEST)
        .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, error));
    }

    const newEmailTemplate = await emailTemplateRepository.createEmailTemplate({
      ...req.body,
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
  } catch (error: any) {
    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(createResponse(RESPONSE_CODE.INTERNAL_SERVER_ERROR, error || Messages.INTERNAL_ERROR));
  }
}

export async function PUT(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { id } = req.body;

    const { error } = validateBody(emailTemplateSchema, req.body);
    if (error) {
      return res
        .status(RESPONSE_CODE.BAD_REQUEST)
        .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, error));
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
        .json(createError(res, RESPONSE_CODE.NOT_FOUND, Messages.ID_REQUIRE));
    }
    const emailTemplate = await emailTemplateRepository.findEmailTemplateById(
      emailTemplateId?.toString() || '',
    );

    if (emailTemplate?.isActive) {
      return res
        .status(RESPONSE_CODE.CONFLICT)
        .json(createError(res, RESPONSE_CODE.CONFLICT, Messages.NOT_DELETE_TEMPLATE));
    }
    await emailTemplateRepository.delete(emailTemplateId?.toString() || '');
    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, Messages.DELETE_EMAIL_TEMPLATE_SUCCESS));
  } catch (error: any) {
    if (error.message === Messages.COMMENT_NOT_FOUND) {
      return res
        .status(RESPONSE_CODE.NOT_FOUND)
        .json(createError(res, RESPONSE_CODE.NOT_FOUND, Messages.EMAIL_TEMPLATE_NOT_FOUND));
    }
    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(
        createError(
          res,
          RESPONSE_CODE.INTERNAL_SERVER_ERROR,
          Messages.INTERNAL_ERROR || error.message,
        ),
      );
  }
}
