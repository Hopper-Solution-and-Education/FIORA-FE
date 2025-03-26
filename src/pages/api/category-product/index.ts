import { createResponse } from '@/config/createResponse';
import { categoryProductsUseCase } from '@/features/setting/application/use-cases/categoryProductUsecase';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { NextApiRequest, NextApiResponse } from 'next';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';

export default sessionWrapper(async (req, res, userId) => {
  switch (req.method) {
    case 'POST':
      return POST(req, res, userId);
    case 'GET':
      return GET(req, res, userId);
    default:
      return res
        .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
        .json({ error: 'Phương thức không được hỗ trợ' });
  }
});

// Get all category products
export async function GET(req: NextApiRequest, res: NextApiResponse, userId: string) {
  if (req.method !== 'GET') {
    return res.status(RESPONSE_CODE.METHOD_NOT_ALLOWED).json({ error: 'Method not allowed' });
  }
  try {
    const { page, pageSize } = req.query;

    const categoryProducts = await categoryProductsUseCase.getAllCategoryProducts({
      userId,
      page: Number(page) || 1,
      pageSize: Number(pageSize) || 20,
    });

    return res
      .status(RESPONSE_CODE.OK)
      .json(
        createResponse(
          RESPONSE_CODE.OK,
          'Get all category products successfully',
          categoryProducts,
        ),
      );
  } catch (error: any) {
    res.status(error.status || RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}

// Create a new category product
export async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { icon, name, description, tax_rate } = req.body;

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
          'Create category product successfully',
          newCategoryProduct,
        ),
      );
  } catch (error: any) {
    res.status(error.status || RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}
