import { productUseCase } from '@/features/setting/api/domain/use-cases/productUseCase';
import { Messages } from '@/shared/constants';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createErrorResponse } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { PaginationResponse } from '@/shared/types';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { validateBody } from '@/shared/utils/validate';
import { productBodySchema } from '@/shared/validators/productValidator';
import { Product, ProductType } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export const maxDuration = 30; // 30 seconds

export default sessionWrapper((req: NextApiRequest, res: NextApiResponse, userId: string) =>
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
            .json({ error: 'Method is not allowed' });
      }
    },
    req,
    res,
  ),
);

// Get all products
export async function GET(req: NextApiRequest, res: NextApiResponse, userId: string) {
  if (req.method !== 'GET') {
    return res.status(RESPONSE_CODE.METHOD_NOT_ALLOWED).json({ error: 'Method not allowed' });
  }
  const { page, pageSize, isPaginate = true } = req.query;

  let categories: PaginationResponse<Product> | Product[] = [];
  if (!isPaginate) {
    categories = await productUseCase.getAllProducts({ userId });
  } else {
    categories = await productUseCase.getAllProductsPagination({
      userId,
      page: Number(page) || 1,
      pageSize: Number(pageSize) || 20,
    });
  }

  return res
    .status(RESPONSE_CODE.OK)
    .json(createResponse(RESPONSE_CODE.OK, Messages.GET_ALL_PRODUCT_SUCCESS, categories));
}

// Create a new product & service
export async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const {
    icon,
    name,
    description,
    tax_rate,
    price,
    type,
    category_id,
    items = '',
    currency,
  } = req.body;

  if (![ProductType.Product, ProductType.Service, ProductType.Edu].includes(type)) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createResponse(RESPONSE_CODE.BAD_REQUEST, Messages.INVALID_PRODUCT_TYPE, null));
  }
  const { error } = validateBody(productBodySchema, req.body);

  if (error) {
    return res
      .status(RESPONSE_CODE.BAD_REQUEST)
      .json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, error));
  }

  const newProduct = await productUseCase.createProduct({
    userId,
    type: type as ProductType,
    icon,
    name,
    description,
    tax_rate,
    price,
    category_id,
    items,
    currency,
  });

  return res
    .status(RESPONSE_CODE.CREATED)
    .json(createResponse(RESPONSE_CODE.CREATED, Messages.CREATE_PRODUCT_SUCCESS, newProduct));
}
