import { prisma } from '@/config';
import { categoryProductsUseCase } from '@/features/setting/api/domain/use-cases/categoryProductUsecase';
import { Messages } from '@/shared/constants';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createErrorResponse } from '@/shared/lib';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { validateBody } from '@/shared/utils/validate';
import { categoryProductBodySchema } from '@/shared/validators/productCategoryValidator';
import { NextApiRequest, NextApiResponse } from 'next';

export const maxDuration = 30; // 30 seconds

export default sessionWrapper(async (req, res, userId) => {
  switch (req.method) {
    case 'PUT':
      return PUT(req, res, userId);
    case 'DELETE':
      return DELETE(req, res, userId);
    case 'GET':
      return GET(req, res, userId);
    default:
      return res.status(RESPONSE_CODE.METHOD_NOT_ALLOWED).json({ error: 'Method is not allowed' });
  }
});

// Get all category products
export async function GET(req: NextApiRequest, res: NextApiResponse, userId: string) {
  if (req.method !== 'GET') {
    return res.status(RESPONSE_CODE.METHOD_NOT_ALLOWED).json({ error: 'Method not allowed' });
  }
  try {
    const { id } = req.query;

    const categoryProducts = await categoryProductsUseCase.getCategoryProductById({
      userId,
      id: id as string,
    });

    return res
      .status(RESPONSE_CODE.OK)
      .json(
        createResponse(
          RESPONSE_CODE.OK,
          Messages.GET_DETAIL_CATEGORY_PRODUCT_SUCCESS,
          categoryProducts,
        ),
      );
  } catch (error: any) {
    res
      .status(error.status || RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(createResponse(RESPONSE_CODE.INTERNAL_SERVER_ERROR, error.message, null));
  }
}

// update an exist category product
export async function PUT(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const id = req.query.id as string;
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

    if (isExistName && isExistName.id !== id) {
      return res
        .status(RESPONSE_CODE.BAD_REQUEST)
        .json(
          createResponse(RESPONSE_CODE.BAD_REQUEST, Messages.CATEGORY_PRODUCT_NAME_EXIST, null),
        );
    }

    const newCategoryProduct = await categoryProductsUseCase.updateCategoryProduct(id, {
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
          Messages.UPDATE_CATEGORY_PRODUCT_SUCCESS,
          newCategoryProduct,
        ),
      );
  } catch (error: any) {
    res
      .status(error.status || RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(createResponse(RESPONSE_CODE.INTERNAL_SERVER_ERROR, error.message, null));
  }
}

// delete an exist category product
export async function DELETE(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { id } = req.query;

    await categoryProductsUseCase.deleteCategoryProduct({
      userId,
      id: id as string,
    });

    return res
      .status(RESPONSE_CODE.CREATED)
      .json(createResponse(RESPONSE_CODE.CREATED, Messages.DELETE_CATEGORY_PRODUCT_SUCCESS, null));
  } catch (error: any) {
    res
      .status(error.status || RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(createResponse(RESPONSE_CODE.INTERNAL_SERVER_ERROR, error.message, null));
  }
}
