import { walletUseCase } from '@/features/setting/api/domain/use-cases/walletUsecase';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createError, createResponse } from '@/shared/lib/responseUtils/createResponse';
import { _PaginationResponse } from '@/shared/types/httpResponse.types';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

export default sessionWrapper(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    switch (req.method) {
      case 'GET':
        return GET(req, res);
      case 'PUT':
        return PUT(req, res);
      default:
        return createError(res, RESPONSE_CODE.METHOD_NOT_ALLOWED, Messages.METHOD_NOT_ALLOWED);
    }
  } catch (error: any) {
    return createError(
      res,
      RESPONSE_CODE.INTERNAL_SERVER_ERROR,
      error.message || Messages.INTERNAL_ERROR,
    );
  }
});

async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { page = '1', pageSize = '10' } = req.query;

    const pageNum = parseInt(page as string, 10);
    const pageSizeNum = parseInt(pageSize as string, 10);

    if (isNaN(pageNum) || isNaN(pageSizeNum) || pageNum < 1 || pageSizeNum < 1) {
      return createError(res, RESPONSE_CODE.BAD_REQUEST, Messages.INVALID_PAGE_OR_PAGE_SIZE);
    }

    const data = await walletUseCase.getDepositRequestsPaginated(pageNum, pageSizeNum);

    return res.status(RESPONSE_CODE.OK).json({
      status: RESPONSE_CODE.OK,
      message: Messages.GET_DEPOSIT_REQUEST_SUCCESS,
      data,
    } as _PaginationResponse<any>);
  } catch (error: any) {
    return createError(
      res,
      RESPONSE_CODE.INTERNAL_SERVER_ERROR,
      error.message || Messages.INTERNAL_ERROR,
    );
  }
}

async function PUT(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, status, remark } = req.body;
    if (!id || !status) {
      return createError(res, RESPONSE_CODE.BAD_REQUEST, Messages.MISSING_PARAMS_INPUT);
    }

    if (status !== 'Approved' && status !== 'Rejected') {
      return createError(res, RESPONSE_CODE.BAD_REQUEST, Messages.INVALID_STATUS);
    }

    if (status === 'Rejected' && !remark) {
      return createError(res, RESPONSE_CODE.BAD_REQUEST, 'Missing rejection reason');
    }

    const updated = await walletUseCase.updateDepositRequestStatus(id, status, remark);
    if (!updated) {
      return createError(
        res,
        RESPONSE_CODE.BAD_REQUEST,
        Messages.UPDATE_DEPOSIT_REQUEST_STATUS_FAILED,
      );
    }

    return res
      .status(RESPONSE_CODE.OK)
      .json(
        createResponse(RESPONSE_CODE.OK, Messages.UPDATE_DEPOSIT_REQUEST_STATUS_SUCCESS, updated),
      );
  } catch (error: any) {
    return createError(
      res,
      RESPONSE_CODE.INTERNAL_SERVER_ERROR,
      error.message || Messages.INTERNAL_ERROR,
    );
  }
}
