import { referralUseCase } from '@/features/referral/application/use-cases/referralUseCase';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import type { NextApiRequest, NextApiResponse } from 'next';

export default sessionWrapper((req: NextApiRequest, res: NextApiResponse, userId: string) =>
  errorHandler(
    async (request, response) => {
      switch (request.method) {
        case 'GET': {
          const { status, search, page, pageSize } = request.query;
          const result = await referralUseCase.listInvites({
            userId,
            status: status as any,
            emailSearch: (search as string) || undefined,
            page: page ? Number(page) : 1,
            pageSize: pageSize ? Number(pageSize) : 10,
          });
          return response
            .status(RESPONSE_CODE.OK)
            .json(createResponse(RESPONSE_CODE.OK, 'OK', result));
        }
        case 'POST': {
          const body = request.body || {};
          const emails = Array.isArray(body.emails) ? (body.emails as string[]) : [];
          if (!emails.length) {
            return response
              .status(RESPONSE_CODE.BAD_REQUEST)
              .json(createResponse(RESPONSE_CODE.BAD_REQUEST, 'emails is required', null));
          }
          const result = await referralUseCase.inviteByEmails(userId, emails, userId);
          return response
            .status(RESPONSE_CODE.OK)
            .json(createResponse(RESPONSE_CODE.OK, 'OK', result));
        }
        default:
          return response
            .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
            .json(createResponse(RESPONSE_CODE.METHOD_NOT_ALLOWED, 'Method not allowed', null));
      }
    },
    req,
    res,
  ),
);
