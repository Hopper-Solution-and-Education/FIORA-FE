import { prisma } from '@/config';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { BudgetType } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

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

// get budget by id
export async function GET(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { year: budgetId, type: budgetType } = req.query;
    const budget = await prisma.budgetsTable.findUnique({
      where: {
        fiscalYear_type_userId: {
          fiscalYear: Number(budgetId),
          type: budgetType as BudgetType,
          userId,
        },
      },
    });

    if (!budget) {
      return res.status(RESPONSE_CODE.NOT_FOUND).json({ message: 'Budget not found' });
    }

    const budgetResponse = {
      id: budget.id,
      fiscalYear: budget.fiscalYear,
      estimatedTotalExpense: Number(budget.total_exp),
      estimatedTotalIncome: Number(budget.total_inc),
      description: budget.description,
      icon: budget.icon,
      currency: budget.currency,
    };

    return res.status(RESPONSE_CODE.OK).json(budgetResponse);
  } catch (error: any) {
    return res.status(RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
}
