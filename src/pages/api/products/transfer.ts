import { createError, createResponse } from '@/config/createResponse';
import { productUseCase } from '@/features/setting/application/use-cases/productUseCase';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

export default sessionWrapper(async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
  try {
    switch (req.method) {
      case 'POST':
        return POST(req, res, userId);
      default:
        return createError(res, RESPONSE_CODE.METHOD_NOT_ALLOWED, Messages.METHOD_NOT_ALLOWED);
    }
  } catch (error: any) {
    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(createResponse(RESPONSE_CODE.INTERNAL_SERVER_ERROR, error || Messages.INTERNAL_ERROR));
  }
});

// Transfer transaction from product to another target product
export async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { sourceId, targetId } = req.body;

    const transferRes = await productUseCase.transferProductTransaction({
      userId,
      sourceId,
      targetId,
    });

    return res
      .status(RESPONSE_CODE.CREATED)
      .json(
        createResponse(RESPONSE_CODE.CREATED, Messages.TRANSFER_TRANSACTION_SUCCESS, transferRes),
      );
  } catch (error: any) {
    return createError(
      res,
      RESPONSE_CODE.INTERNAL_SERVER_ERROR,
      error.message || Messages.INTERNAL_ERROR,
    );
  }
}
