import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { categoryProductsUseCase } from '@/features/setting/application/use-cases/categoryProductUsecase';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

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
