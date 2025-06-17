import { budgetUseCase } from '@/features/setting/api/domain/use-cases/budgetUsecase';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createErrorResponse } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { validateBody } from '@/shared/utils/validate';
import { budgetCreateBody } from '@/shared/validators/budgetValidator';
import { Currency } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export const maxDuration = 30; // 30 seconds

export default sessionWrapper(async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
  try {
    switch (req.method) {
      case 'POST':
        return POST(req, res, userId);
      case 'GET':
        return GET(req, res, userId);
      case 'PUT':
        return PUT(req, res, userId);
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
    const { fiscalYear, estimatedTotalExpense, estimatedTotalIncome, description, icon, currency } =
      req.body;

    const { error } = validateBody(budgetCreateBody, req.body);

    if (error) {
      return res
        .status(RESPONSE_CODE.BAD_REQUEST)
        .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, error));
    }

    // check duplicated fiscalYear
    const isDuplicated = await budgetUseCase.checkedDuplicated(userId, fiscalYear);
    if (isDuplicated) {
      return res.status(RESPONSE_CODE.BAD_REQUEST).json(
        createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, {
          fiscalYear: Messages.DUPLICATED_BUDGET_FISCAL_YEAR,
        }),
      );
    }

    const newBudget = await budgetUseCase.createBudgetTransaction({
      userId,
      fiscalYear,
      estimatedTotalExpense,
      estimatedTotalIncome,
      description,
      icon,
      currency,
    });

    return res
      .status(RESPONSE_CODE.CREATED)
      .json(createResponse(RESPONSE_CODE.CREATED, Messages.CREATE_BUDGET_SUCCESS, newBudget));
  } catch (error: any) {
    return res
      .status(error.status || RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(createErrorResponse(error.status, error.message, error));
  }
}

export async function GET(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { cursor, take, search } = req.query; // Cursor will be a year (e.g., 2023)
    // take default take when its not given
    const takeValue = take ? Number(take) : 3; // Default to 10 if not provided
    const currency = (req.headers['x-user-currency'] as string as Currency) ?? Currency.VND;

    const budgets = await budgetUseCase.getAnnualBudgetByYears({
      userId,
      cursor: cursor ? Number(cursor) : undefined,
      take: takeValue,
      currency,
      search: search ? String(search) : undefined,
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

export async function PUT(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const currency = (req.headers['x-user-currency'] as string as Currency) ?? Currency.VND;

    const updatedRes = await budgetUseCase.updateActBudgetTotalYears(userId, currency);

    return res
      .status(RESPONSE_CODE.CREATED)
      .json(createResponse(RESPONSE_CODE.CREATED, Messages.UPDATE_BUDGET_SUCCESS, updatedRes));
  } catch (error: any) {
    return res
      .status(error.status || RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(createErrorResponse(error.status, error.message, error));
  }
}
