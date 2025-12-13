import { transactionUseCase } from '@/features/transaction/application/use-cases/transactionUseCase';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { errorHandler } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { NextApiResponse } from 'next';

export default sessionWrapper((req, res) =>
  errorHandler(
    async (request, response) => {
      switch (request.method) {
        case 'PATCH':
          return PATCH(response);
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

export async function PATCH(res: NextApiResponse) {
  const { syncSendingFlow, syncWithdrawFlow, syncDepositFlow } =
    await transactionUseCase.syncAllFlowTypeTransaction();

  return res.status(RESPONSE_CODE.CREATED).json(
    createResponse(RESPONSE_CODE.CREATED, Messages.SYNC_TRANSACTION_SUCCESS, {
      numberSyncSendingFlow: Number(syncSendingFlow),
      numberSyncWithdrawFlow: Number(syncWithdrawFlow),
      numberSyncDepositFlow: Number(syncDepositFlow),
    }),
  );
}
