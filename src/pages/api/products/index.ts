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
}

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

// Create a new product
export async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { icon, name, description, tax_rate, price, type, category_id, items = [] } = req.body;

    if ([ProductType.Product, ProductType.Service].includes(type)) {
      return res.status(RESPONSE_CODE.BAD_REQUEST).json({ message: 'Invalid product type' });
    }

    const newCategory = await productUseCase.createProduct({
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
      .json(createResponse(RESPONSE_CODE.CREATED, 'Create product successfully', newCategory));
  } catch (error: any) {
    res.status(error.status || RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}
