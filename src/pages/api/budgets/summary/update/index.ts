import { budgetSummaryUseCase } from '@/features/setting/api/domain/use-cases/budgetSummaryUsecase';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createErrorResponse } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { validateBody } from '@/shared/utils/validate';
import { budgeDashboardUpdateBody } from '@/shared/validators/budgetValidator';
import { Currency } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default sessionWrapper(async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
  try {
    switch (req.method) {
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

export async function PUT(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { updateTopBudget, type, fiscalYear } = req.body;
    const currency = (req.headers['x-user-currency'] as string as Currency) ?? Currency.VND;

    if (!fiscalYear) {
      return res.status(RESPONSE_CODE.BAD_REQUEST).json(
        createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, {
          fiscalYear: 'Fiscal year is required',
        }),
      );
    }

    const { error } = validateBody(budgeDashboardUpdateBody, req.body);

    if (error) {
      return res
        .status(RESPONSE_CODE.BAD_REQUEST)
        .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, error));
    }

    const updateBudget = await budgetSummaryUseCase.updateBudgetDetails({
      userId,
      fiscalYear,
      type,
      updateTopBudget,
      currency,
    });

    return res
      .status(RESPONSE_CODE.CREATED)
      .json(createResponse(RESPONSE_CODE.CREATED, Messages.UPDATE_BUDGET_SUCCESS, updateBudget));
  } catch (error: any) {
    return res
      .status(error.status || RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(createErrorResponse(error.status, error.message, error));
  }
}
