import { budgetUseCase } from '@/features/setting/api/domain/use-cases/budgetUsecase';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createErrorResponse } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { validateBody } from '@/shared/utils/validate';
import { budgetCreateBody } from '@/shared/validators/budgetValidator';
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

    const newProduct = await budgetUseCase.createBudget({
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
      .json(createResponse(RESPONSE_CODE.CREATED, Messages.CREATE_PRODUCT_SUCCESS, newProduct));
  } catch (error: any) {
    return res
      .status(error.status || RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(createErrorResponse(error.status, error.message, error));
  }
}
