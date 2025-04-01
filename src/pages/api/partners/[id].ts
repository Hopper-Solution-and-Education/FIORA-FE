import { createError, createResponse } from '@/config/createResponse';
import { partnerUseCase } from '@/features/partner/application/use-cases/partnerUseCase';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

export default withAuthorization({
  PUT: ['User', 'Admin', 'CS'],
  GET: ['User', 'Admin', 'CS'], // Thêm quyền cho GET
})(async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
  switch (req.method) {
    case 'PUT':
      return PUT(req, res, userId);
    case 'GET':
      return GET(req, res, userId);
    default:
      return res
        .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
        .json({ error: 'Phương thức không được hỗ trợ' });
  }
});

// Thêm hàm GET để lấy partner theo ID
export async function GET(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { id } = req.query;

    const partner = await partnerUseCase.getPartnerById(id as string, userId);

    if (!partner) {
      return res
        .status(RESPONSE_CODE.NOT_FOUND)
        .json(createError(res, RESPONSE_CODE.NOT_FOUND, Messages.PARTNER_NOT_FOUND));
    }

    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, Messages.GET_PARTNER_SUCCESS, partner));
  } catch (error: any) {
    return res
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

export async function PUT(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { id } = req.query;

    const updatedPartner = await partnerUseCase.editPartner(id as string, userId, req.body);
    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, Messages.UPDATE_PARTNER_SUCCESS, updatedPartner));
  } catch (error: any) {
    return res
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
