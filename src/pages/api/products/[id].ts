import { productUseCase } from '@/features/setting/application/use-cases/productUseCase';
import { createResponse } from '@/lib/createResponse';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { ProductType } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

// Define the expected session structure
export async function getUserSession(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return null;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const timeLeft = session.expiredTime - currentTime;
  if (timeLeft <= 0) {
    return null;
  }

  return session;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getUserSession(req, res);
  if (!session || !session.user?.id) {
    return res.status(RESPONSE_CODE.UNAUTHORIZED).json({ message: 'Chưa đăng nhập' });
  }

  const userId = session.user.id;

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
}

// Get all products
export async function GET(req: NextApiRequest, res: NextApiResponse, userId: string) {
  if (req.method !== 'GET') {
    return res.status(RESPONSE_CODE.METHOD_NOT_ALLOWED).json({ error: 'Method not allowed' });
  }
  try {
    const { id } = req.query;
    const product = await productUseCase.getProductById({
      userId,
      id: id as string,
    });

    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, 'Get product by id successfully', product));
  } catch (error: any) {
    res.status(error.status || RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}

// Create a new product
export async function PUT(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { id } = req.query;
    const { icon, name, description, tax_rate, price, type, category_id, items = [] } = req.body;

    if ([ProductType.Product, ProductType.Service].includes(type)) {
      return res.status(RESPONSE_CODE.BAD_REQUEST).json({ message: 'Invalid product type' });
    }

    const newCategory = await productUseCase.updateProduct({
      userId,
      type: type as ProductType,
      icon,
      name,
      description,
      tax_rate,
      price,
      category_id,
      items,
      id: id as string,
    });

    return res
      .status(RESPONSE_CODE.CREATED)
      .json(createResponse(RESPONSE_CODE.CREATED, 'update product successfully', newCategory));
  } catch (error: any) {
    res.status(error.status || RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}

export async function DELETE(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { id } = req.query;

    const newCategory = await productUseCase.deleteProduct({
      userId,
      id: id as string,
    });

    return res
      .status(RESPONSE_CODE.CREATED)
      .json(createResponse(RESPONSE_CODE.CREATED, 'Delete product successfully', newCategory));
  } catch (error: any) {
    res.status(error.status || RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}
