import { prisma } from '@/config';
import { identificationRepository } from '@/features/setting/api/infrastructure/repositories/indentificationRepository';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { Messages } from '@/shared/constants/message';
import { createErrorResponse } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { SessionUser } from '@/shared/types/session';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { validateBody } from '@/shared/utils/validate';
import {
  identificationDocumentSchema,
  updateIdentificationDocumentSchema,
} from '@/shared/validators/identificationValidator';
import { KYCStatus } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export const maxDuration = 30; // 30 seconds

export default sessionWrapper(
  (req: NextApiRequest, res: NextApiResponse, userId: string, user: SessionUser) =>
    errorHandler(
      async (request, response) => {
        switch (request.method) {
          case 'POST':
            return POST(request, response, userId, user);
          case 'PUT':
            return PUT(request, response, userId);
          case 'GET':
            return GET(response, userId);
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

export async function GET(res: NextApiResponse, userId: string) {
  const identification = await identificationRepository.getByUserId(userId);

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');

  return res
    .status(RESPONSE_CODE.OK)
    .json(createResponse(RESPONSE_CODE.OK, Messages.GET_IDENTIFICATION_SUCCESS, identification));
}

export async function PUT(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { error, value } = validateBody(updateIdentificationDocumentSchema, req.body);
  const {
    fileFrontId,
    fileBackId,
    idAddress,
    issuedDate,
    type,
    idNumber,
    filePhotoId,
    issuedPlace,
    fileLocationId,
    ekycId,
  } = value;

  if (error) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, error));
  }

  // Check if identification document exists and belongs to user
  const existingDoc = await identificationRepository.getByType(userId, type);
  if (!existingDoc) {
    return res
      .status(RESPONSE_CODE.NOT_FOUND)
      .json(createErrorResponse(RESPONSE_CODE.NOT_FOUND, Messages.IDENTIFICATION_NOT_FOUND));
  }

  if (existingDoc.userId !== userId) {
    return res
      .status(RESPONSE_CODE.FORBIDDEN)
      .json(
        createErrorResponse(
          RESPONSE_CODE.FORBIDDEN,
          'You do not have permission to update this document',
        ),
      );
  }

  // Validate attachment IDs if provided
  const attachmentIdsToValidate = [filePhotoId, fileBackId, fileFrontId, fileLocationId].filter(
    Boolean,
  ) as string[];
  if (attachmentIdsToValidate.length > 0) {
    const found = await prisma.attachment.findMany({
      where: { id: { in: attachmentIdsToValidate } },
    });
    const foundIds = new Set(found.map((a) => a.id));
    const missing = attachmentIdsToValidate.filter((attachmentId) => !foundIds.has(attachmentId));
    if (missing.length > 0) {
      return res
        .status(RESPONSE_CODE.BAD_REQUEST)
        .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, 'Invalid attachment id(s)'));
    }
  }

  // Update identification document
  const updatedIdentification = await identificationRepository.update(
    existingDoc.id,
    ekycId,
    userId,
    {
      filePhoto: filePhotoId ? { connect: { id: filePhotoId } } : undefined,
      fileBack: fileBackId ? { connect: { id: fileBackId } } : undefined,
      fileFront: fileFrontId ? { connect: { id: fileFrontId } } : undefined,
      fileLocation: fileLocationId ? { connect: { id: fileLocationId } } : undefined,
      idNumber: idNumber,
      type: type,
      idAddress: idAddress || '',
      issuedDate: issuedDate || null,
      issuedPlace: issuedPlace || '',
      status: KYCStatus.PENDING,
      updatedAt: new Date(),
    },
  );

  return res
    .status(RESPONSE_CODE.OK)
    .json(
      createResponse(
        RESPONSE_CODE.OK,
        Messages.UPDATE_IDENTIFICATION_SUCCESS,
        updatedIdentification,
      ),
    );
}

export async function POST(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string,
  user: SessionUser,
) {
  const { error, value } = validateBody(identificationDocumentSchema, req.body);

  if (error) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, error));
  }

  const {
    fileFrontId,
    fileBackId,
    idAddress,
    issuedDate,
    type,
    idNumber,
    filePhotoId,
    issuedPlace,
    fileLocationId,
  } = value;

  const checkVerify = await identificationRepository.getByType(userId, type);
  if (checkVerify) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VERIFY_EXIT));
  }

  const checkIdentification = await identificationRepository.checkIdentification(
    type,
    idNumber,
    userId,
  );
  if (checkIdentification) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VERIFY_EXIT));
  }

  const attachmentIdsToValidate = [filePhotoId, fileBackId, fileFrontId, fileLocationId].filter(
    Boolean,
  ) as string[];
  if (attachmentIdsToValidate.length > 0) {
    const found = await prisma.attachment.findMany({
      where: { id: { in: attachmentIdsToValidate } },
    });
    const foundIds = new Set(found.map((a) => a.id));
    const missing = attachmentIdsToValidate.filter((id) => !foundIds.has(id));
    if (missing.length > 0) {
      return res
        .status(RESPONSE_CODE.BAD_REQUEST)
        .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, 'Invalid attachment id(s)'));
    }
  }
  const newIdentification = await identificationRepository.create(
    {
      filePhoto: filePhotoId ? { connect: { id: filePhotoId } } : undefined,
      fileBack: fileBackId ? { connect: { id: fileBackId } } : undefined,
      fileFront: fileFrontId ? { connect: { id: fileFrontId } } : undefined,
      fileLocation: fileLocationId ? { connect: { id: fileLocationId } } : undefined,
      idNumber: idNumber,
      type: type,
      idAddress: idAddress || '',
      issuedDate: issuedDate || null,
      issuedPlace: issuedPlace || '',
      status: KYCStatus.PENDING,
      User: { connect: { id: userId } },
      createdAt: new Date(),
      updatedAt: new Date(),
      remarks: '',
      id: crypto.randomUUID(),
    },
    user,
  );
  return res
    .status(RESPONSE_CODE.CREATED)
    .json(
      createResponse(
        RESPONSE_CODE.CREATED,
        Messages.CREATE_IDENTIFICATION_SUCCESS,
        newIdentification,
      ),
    );
}
