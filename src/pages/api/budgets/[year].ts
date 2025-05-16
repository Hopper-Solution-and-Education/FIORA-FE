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
      case 'DELETE':
        return DELETE(req, res, userId);

      default:
        return res
          .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
          .json({ error: 'Method is not allowed' });
    }
  } catch (error: any) {
    return res.status(RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
});

// update budget
export async function PUT(req: NextApiRequest, res: NextApiResponse, userId: string) {
  // hiện tại api này đang chỉ phục vụ cho việc update budget type top down planning
  try {
    // get budget year and type
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

    // validate body
    const { error } = validateBody(budgetCreateBody, req.body);
    if (error) {
      return res
        .status(RESPONSE_CODE.BAD_REQUEST)
        .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, error));
    }

    if (!budgetYear || typeof budgetYear !== 'string') {
      return res
        .status(RESPONSE_CODE.BAD_REQUEST)
        .json(
          createErrorResponse(
            RESPONSE_CODE.BAD_REQUEST,
            Messages.MISSING_PARAMS_INPUT + ' budget year',
          ),
        );
    }

    // check if fiscal year is duplicated
    if (fiscalYear !== Number(budgetYear)) {
      const isDuplicated = await budgetUseCase.checkedDuplicated(userId, fiscalYear);
      if (isDuplicated) {
        return res.status(RESPONSE_CODE.BAD_REQUEST).json(
          createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, {
            fiscalYear: Messages.DUPLICATED_BUDGET_FISCAL_YEAR,
          }),
        );
      }
    }

    // get budget to update
    const budgetToUpdate = await prisma.budgetsTable.findUnique({
      where: {
        fiscalYear_type_userId: {
          fiscalYear: budgetYear.toString(),
          type: type as BudgetType,
          userId,
        },
      },
    });

    if (!budgetToUpdate) {
      return res.status(RESPONSE_CODE.NOT_FOUND).json({ message: 'Budget not found' });
    }

    // update budget
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

// get budget by fiscal year and type
export async function GET(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { year: budgetId, type: budgetType } = req.query;

    // check if budgetId is valid
    if (!budgetId || typeof budgetId !== 'string') {
      return res
        .status(RESPONSE_CODE.BAD_REQUEST)
        .json(createResponse(RESPONSE_CODE.BAD_REQUEST, Messages.BUDGET_ID_MISSING, null));
    }

    // check if budget is found
    const budget = await prisma.budgetsTable.findUnique({
      where: {
        fiscalYear_type_userId: {
          fiscalYear: budgetId.toString(),
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

// delete budget top bot
export async function DELETE(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { year: budgetYear } = req.query;

    // Basic validation for missing ID
    if (!budgetYear || typeof budgetYear !== 'string') {
      return res
        .status(RESPONSE_CODE.BAD_REQUEST)
        .json(createResponse(RESPONSE_CODE.BAD_REQUEST, Messages.BUDGET_ID_MISSING, null)); // Added a specific message
    }

    // --- Optimization: Dynamically build the data object ---
    // List all the fields that represent financial values to be zeroed out
    const financialFieldsToZero: string[] = [];
    const budgetType = [BudgetType.Top, BudgetType.Bot];
    const types = ['exp', 'inc'];

    // Add total fields
    financialFieldsToZero.push('total_exp', 'total_inc');

    // Add half-yearly fields (h1_exp, h1_inc, h2_exp, h2_inc)
    for (let i = 1; i <= 2; i++) {
      types.forEach((type) => {
        financialFieldsToZero.push(`h${i}_${type}`);
      });
    }

    // Add quarterly fields (q1_exp, q1_inc, ..., q4_exp, q4_inc)
    for (let i = 1; i <= 4; i++) {
      types.forEach((type) => {
        financialFieldsToZero.push(`q${i}_${type}`);
      });
    }

    // Add monthly fields (m1_exp, m1_inc, ..., m12_exp, m12_inc)
    for (let i = 1; i <= 12; i++) {
      types.forEach((type) => {
        financialFieldsToZero.push(`m${i}_${type}`);
      });
    }
    // --- End Dynamic Generation ---

    // Create the update data object using the dynamically generated list
    const updateData: { [key: string]: number } = Object.fromEntries(
      financialFieldsToZero.map((field) => [field, 0]),
    );

    // Perform the update operation
    // This will set all fields listed in financialFieldsToZero to 0
    await Promise.all(
      budgetType.map(async (type) => {
        await prisma.budgetsTable.update({
          where: {
            fiscalYear_type_userId: {
              fiscalYear: budgetYear.toString(),
              type: type as BudgetType,
              userId,
            },
          },
          data: updateData,
        });
      }),
    );
    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, Messages.BUDGET_DELETE_SUCCESS, null));
  } catch (error: any) {
    // Handle other potential errors (database errors, etc.)
    console.error('Error deleting budget:', error); // Log the error for debugging
    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(createResponse(RESPONSE_CODE.INTERNAL_SERVER_ERROR, Messages.INTERNAL_ERROR, null)); // Use generic internal server error message
    // --- End Improved Error Handling ---
  }
}
