import { createResponse } from '@/config/createResponse';
import { categoryProductsUseCase } from '@/features/setting/application/use-cases/categoryProductUsecase';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

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
    return res.status(RESPONSE_CODE.UNAUTHORIZED).json({ message: Messages.UNAUTHORIZED });
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
