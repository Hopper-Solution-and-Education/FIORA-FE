import { AccountUseCaseInstance } from '@/features/auth/application/use-cases/accountUseCase';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { errorHandler } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { GlobalFilters } from '@/shared/types';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

export const maxDuration = 30; // 30 seconds

export default withAuthorization({
  POST: ['User', 'Admin', 'CS', 'Guest'],
  GET: ['User', 'Admin', 'CS', 'Guest'],
})((req: NextApiRequest, res: NextApiResponse, userId: string) =>
  errorHandler(
    async (request, response) => {
      switch (request.method) {
        case 'POST':
          return POST(request, response, userId);
        default:
          return response
            .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
            .json({ error: 'Phương thức không được hỗ trợ' });
      }
    },
    req,
    res,
  ),
);

export async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    console.log('🔍 Next.js API Route - userId from session:', userId);

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const params = req.body as GlobalFilters;
    console.log('📦 Request body params:', JSON.stringify(params));

    const { isParent } = req.query;
    if (isParent) {
      const accounts = await AccountUseCaseInstance.getAllParentAccountFilter(userId, params);
      return res
        .status(200)
        .json(createResponse(RESPONSE_CODE.OK, 'Lấy danh sách tài khoản thành công', accounts));
    } else {
      const accounts = await AccountUseCaseInstance.getAllAccountByUserIdFilter(userId, params);
      return res
        .status(200)
        .json(createResponse(RESPONSE_CODE.OK, 'Lấy danh sách tài khoản thành công', accounts));
    }
  } catch (error: any) {
    res.status(RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}
