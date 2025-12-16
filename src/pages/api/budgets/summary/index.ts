import { budgetSummaryUseCase } from '@/features/setting/api/domain/use-cases/budgetSummaryUsecase';
import { Messages } from '@/shared/constants';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createErrorResponse } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { BudgetType } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export const maxDuration = 30; // 30 seconds

export default sessionWrapper(async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
  try {
    switch (req.method) {
      case 'GET':
        return GET(req, res, userId);
      default:
        return res
          .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
          .json({ error: 'Method is not allowed' });
    }
  } catch (error: any) {
    return res.status(RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
});

export async function GET(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { fiscalYear, type } = req.query;

    if (!fiscalYear) {
      return res.status(RESPONSE_CODE.BAD_REQUEST).json(
        createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, {
          fiscalYear: 'Fiscal year is required',
        }),
      );
    }

    if (type) {
      const budgetType = type as string;
      if (!Object.values(BudgetType).includes(budgetType as BudgetType)) {
        return res.status(RESPONSE_CODE.BAD_REQUEST).json(
          createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, {
            type: 'Invalid budget type',
          }),
        );
      }

      const budget = await budgetSummaryUseCase.getBudgetByType(
        userId,
        Number(fiscalYear),
        budgetType as BudgetType,
      );

      return res
        .status(RESPONSE_CODE.OK)
        .json(createResponse(RESPONSE_CODE.OK, 'Get budget by type successfully', budget));
    }

    const budgetSummary = await budgetSummaryUseCase.getBudgetsByUserIdAndFiscalYear(
      userId,
      Number(fiscalYear),
    );

    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, 'Get budget summary successfully', budgetSummary));
  } catch (error: any) {
    return res
      .status(error.status || RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(createErrorResponse(error.status, error.message, error));
  }
}
