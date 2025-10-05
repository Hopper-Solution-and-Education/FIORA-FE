import { attachmentRepository } from '@/features/setting/api/infrastructure/repositories/attachmentRepository';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { errorHandler } from '@/shared/lib';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { Prisma } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default sessionWrapper((req: NextApiRequest, res: NextApiResponse, userId: string) =>
  errorHandler(
    async (request, response) => {
      switch (request.method) {
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

async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { url, path, type, size } = req.body;
  if (!url || !path || !type) {
    return res.status(RESPONSE_CODE.BAD_REQUEST).json({ error: Messages.ATTACHMENT_NOT_FOUND });
  }

  try {
    const attachmentData: Prisma.AttachmentUncheckedCreateInput = {
      url,
      path,
      type,
      size,
      createdBy: userId,
    };

    const attachment = await attachmentRepository.createAttachment(attachmentData);
    return res.status(RESPONSE_CODE.OK).json({ data: attachment, status: RESPONSE_CODE.OK });
  } catch (error) {
    console.error(error);
    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json({ error: Messages.INTERNAL_SERVER_ERROR, status: RESPONSE_CODE.INTERNAL_SERVER_ERROR });
  }
}
