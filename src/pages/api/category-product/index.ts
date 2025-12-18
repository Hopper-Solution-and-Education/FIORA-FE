import { prisma } from '@/config';
import { categoryProductsUseCase } from '@/features/setting/api/domain/use-cases/categoryProductUsecase';
import { Messages } from '@/shared/constants';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createErrorResponse } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { validateBody } from '@/shared/utils/validate';
import { categoryProductBodySchema } from '@/shared/validators/productCategoryValidator';
import { NextApiRequest, NextApiResponse } from 'next';

export const maxDuration = 30; // 30 seconds

export default sessionWrapper((req, res, userId) =>
  errorHandler(
    async (request, response) => {
      switch (request.method) {
        case 'POST':
          return POST(request, response, userId);
        case 'GET':
          return GET(request, response, userId);
        default:
          return response
            .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
            .json({ error: 'Phương thức không được hỗ trợ' });
      }
    },
    req,
    res,
  ),
);

export async function GET(req: NextApiRequest, res: NextApiResponse, userId: string) {
  if (req.method !== 'GET') {
    return res.status(RESPONSE_CODE.METHOD_NOT_ALLOWED).json({ error: 'Method not allowed' });
  }
  const { page, pageSize } = req.query;

  const categoryProducts = await categoryProductsUseCase.getAllCategoryProducts({
    userId,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 20,
  });

  return res
    .status(RESPONSE_CODE.OK)
    .json(
      createResponse(RESPONSE_CODE.OK, Messages.GET_CATEGORY_PRODUCT_SUCCESS, categoryProducts),
    );
}

export async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { icon, name, description, tax_rate } = req.body;
  const { error } = validateBody(categoryProductBodySchema, req.body);
  if (error) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, error));
  }
  // check name no matter uppercase or lowercase
  const normalizedName = name.toLowerCase();

  const isExistName = await prisma.categoryProducts.findFirst({
    where: {
      name: {
        mode: 'insensitive',
        equals: normalizedName,
      },
    },
  });

  if (isExistName) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createResponse(RESPONSE_CODE.BAD_REQUEST, Messages.CATEGORY_PRODUCT_NAME_EXIST, null));
  }

  const newCategoryProduct = await categoryProductsUseCase.createCategoryProduct({
    userId,
    icon,
    name,
    description,
    tax_rate,
  });
  return res
    .status(RESPONSE_CODE.CREATED)
    .json(
      createResponse(
        RESPONSE_CODE.CREATED,
        Messages.CREATE_CATEGORY_PRODUCT_SUCCESS,
        newCategoryProduct,
      ),
    );
}
