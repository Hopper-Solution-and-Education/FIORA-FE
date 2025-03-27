import { createResponse } from '@/config/createResponse';
import { productUseCase } from '@/features/setting/application/use-cases/productUseCase';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { ProductType } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default sessionWrapper(async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
  try {
    switch (req.method) {
      case 'POST':
        return POST(req, res, userId);
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

// Get all products
export async function GET(req: NextApiRequest, res: NextApiResponse, userId: string) {
  if (req.method !== 'GET') {
    return res.status(RESPONSE_CODE.METHOD_NOT_ALLOWED).json({ error: 'Method not allowed' });
  }
  try {
    const { page, pageSize } = req.query;

    const categories = await productUseCase.getAllProducts({
      userId,
      page: Number(page) || 1,
      pageSize: Number(pageSize) || 20,
    });

    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, 'Get all products successfully', categories));
  } catch (error: any) {
    res.status(error.status || RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}

// Create a new product & service
export async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { icon, name, description, tax_rate, price, type, category_id, items = '' } = req.body;

    if (![ProductType.Product, ProductType.Service].includes(type)) {
      return res.status(RESPONSE_CODE.BAD_REQUEST).json({ message: 'Invalid product type' });
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
    });

    return res
      .status(RESPONSE_CODE.CREATED)
      .json(createResponse(RESPONSE_CODE.CREATED, 'Create product successfully', newProduct));
  } catch (error: any) {
    res.status(error.status || RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}
