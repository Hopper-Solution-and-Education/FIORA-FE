import { budgetSummaryUseCase } from '@/features/setting/api/domain/use-cases/budgetSummaryUsecase';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createErrorResponse } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { validateBody } from '@/shared/utils/validate';
import {
  budgetDetailsCreateBody,
  budgetDetailsDeleteBody,
} from '@/shared/validators/budgetValidator';
import { BudgetDetailType, Currency, Prisma } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default sessionWrapper(async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
  try {
    switch (req.method) {
      case 'PUT':
        return PUT(req, res, userId);
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

export async function PUT(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { categoryId, fiscalYear, type, bottomUpPlan, actualSumUpPlan } = req.body;

    const currency = (req.headers['x-user-currency'] as string as Currency) ?? Currency.VND;

    if (!fiscalYear) {
      return res.status(RESPONSE_CODE.BAD_REQUEST).json(
        createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, {
          fiscalYear: 'Fiscal year is required',
        }),
      );
    }

    if (type) {
      const budgetType = type as string;
      if (!Object.values(BudgetDetailType).includes(budgetType as BudgetDetailType)) {
        return res.status(RESPONSE_CODE.BAD_REQUEST).json(
          createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, {
            type: 'Invalid budget category type (Expense or Income)',
          }),
        );
      }
    }

    const { error } = validateBody(budgetDetailsCreateBody, req.body);
    if (error) {
      return res
        .status(RESPONSE_CODE.BAD_REQUEST)
        .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, error));
    }

    const budgetRes = await budgetSummaryUseCase.upsertBudgetCategoryDetailsCategory({
      userId,
      fiscalYear,
      categoryId,
      type: type as BudgetDetailType,
      bottomUpPlan,
      actualSumUpPlan,
      currency,
    });

    return res
      .status(RESPONSE_CODE.CREATED)
      .json(
        createResponse(RESPONSE_CODE.CREATED, Messages.BUDGET_DETAIL_UPDATED_SUCCESS, budgetRes),
      );
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return res
        .status(RESPONSE_CODE.CONFLICT)
        .json(
          createErrorResponse(RESPONSE_CODE.CONFLICT, Messages.DUPLICATED_CATEGORY_BUDGET_DETAILS),
        );
    }
    return res
      .status(error.status || RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(createErrorResponse(error.status, error.message, error));
  }
}

export async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { categoryId, fiscalYear, type, isTruncate } = req.body;

    if (!fiscalYear) {
      return res.status(RESPONSE_CODE.BAD_REQUEST).json(
        createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, {
          fiscalYear: 'Fiscal year is required',
        }),
      );
    }

    const { error } = validateBody(budgetDetailsDeleteBody, req.body);
    if (error) {
      return res
        .status(RESPONSE_CODE.BAD_REQUEST)
        .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, error));
    }

    const budgetRes = await budgetSummaryUseCase.deleteBudgetDetailsCategory({
      userId,
      fiscalYear,
      categoryId,
      type,
      isTruncate,
    });

    return res
      .status(RESPONSE_CODE.CREATED)
      .json(
        createResponse(RESPONSE_CODE.CREATED, Messages.BUDGET_DETAIL_DELETED_SUCCESS, budgetRes),
      );
  } catch (error: any) {
    return res
      .status(error.status || RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(createErrorResponse(error.status, error.message, error));
  }
}
