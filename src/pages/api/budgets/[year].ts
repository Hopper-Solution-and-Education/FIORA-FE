import { prisma } from '@/config';
import { budgetUseCase } from '@/features/setting/api/domain/use-cases/budgetUsecase';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createErrorResponse } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { validateBody } from '@/shared/utils/validate';
import { budgetCreateBody } from '@/shared/validators/budgetValidator';
import { BudgetType } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default sessionWrapper(async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
  try {
    switch (req.method) {
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

export async function PUT(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { year: budgetYear } = req.query;
    const {
      fiscalYear,
      estimatedTotalExpense,
      estimatedTotalIncome,
      description,
      icon,
      currency,
      type,
    } = req.body;

    const { error } = validateBody(budgetCreateBody, req.body);
    if (error) {
      return res
        .status(RESPONSE_CODE.BAD_REQUEST)
        .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, error));
    }

    if (fiscalYear !== budgetYear) {
      const isDuplicated = await budgetUseCase.checkedDuplicated(userId, fiscalYear);
      if (isDuplicated) {
        return res.status(RESPONSE_CODE.BAD_REQUEST).json(
          createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, {
            fiscalYear: Messages.DUPLICATED_BUDGET_FISCAL_YEAR,
          }),
        );
      }
    }

    const budgetToUpdate = await prisma.budgetsTable.findUnique({
      where: {
        fiscalYear_type_userId: {
          fiscalYear: Number(budgetYear),
          type: type as BudgetType,
          userId,
        },
      },
    });

    if (!budgetToUpdate) {
      return res.status(RESPONSE_CODE.NOT_FOUND).json({ message: 'Budget not found' });
    }

    const updatedBudget = await budgetUseCase.updateBudgetTransaction({
      budgetId: budgetToUpdate.id,
      userId,
      fiscalYear,
      estimatedTotalExpense,
      estimatedTotalIncome,
      description,
      icon,
      currency,
      type,
    });

    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, Messages.BUDGET_UPDATE_SUCCESS, updatedBudget));
  } catch (error: any) {
    return res.status(RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
}

// get budget by id
export async function GET(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { year: budgetId, type: budgetType } = req.query;

    // check if budget is found
    const budget = await prisma.budgetsTable.findUnique({
      where: {
        fiscalYear_type_userId: {
          fiscalYear: Number(budgetId),
          type: budgetType as BudgetType,
          userId,
        },
      },
    });

    // check if budget is found
    if (!budget) {
      return res.status(RESPONSE_CODE.NOT_FOUND).json({ message: 'Budget not found' });
    }

    // get budget response
    const budgetResponse = {
      id: budget.id,
      fiscalYear: budget.fiscalYear,
      estimatedTotalExpense: Number(budget.total_exp),
      estimatedTotalIncome: Number(budget.total_inc),
      description: budget.description,
      icon: budget.icon,
      currency: budget.currency,
    };

    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, Messages.BUDGET_GET_BY_ID_SUCCESS, budgetResponse));
  } catch (error: any) {
    return res.status(RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
}
