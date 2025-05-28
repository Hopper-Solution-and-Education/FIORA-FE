import { budgetUseCase } from '@/features/setting/api/domain/use-cases/budgetUsecase';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createErrorResponse } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { Currency } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default sessionWrapper(async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
  try {
    switch (req.method) {
      case 'POST':
        return POST(req, res, userId);
      default:
        return res
          .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
          .json({ error: 'Method is not allowed' });
    }
  } catch (error: any) {
    return res.status(RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
});

export async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { cursor, take, search, filters } = req.body; // Cursor will be a year (e.g., 2023)
    // take default take when its not given
    const takeValue = take ? Number(take) : 3; // Default to 10 if not provided
    const currency = (req.headers['x-user-currency'] as string as Currency) ?? Currency.VND;

    await budgetUseCase.updateActBudgetTransaction(userId, currency);

    const budgets = await budgetUseCase.getAnnualBudgetByYears({
      userId,
      cursor: cursor ? Number(cursor) : undefined,
      take: takeValue,
      currency,
      search: search ? String(search) : undefined,
      filters: filters,
    });

    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, Messages.GET_BUDGET_ITEM_SUCCESS, budgets));
  } catch (error: any) {
    return res
      .status(error.status || RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(createErrorResponse(error.status, error.message, error));
  }
}
