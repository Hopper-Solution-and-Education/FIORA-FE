import { CategoryType } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { categoryUseCase } from '@/features/setting/application/use-cases/categoryUseCase';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { authOptions } from '../auth/[...nextauth]';

// Define the expected session structure

export async function getUserSession(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return null;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  if (session.expiredTime < currentTime) {
    return null; // Session expired
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
      case 'PUT':
        return PUT(req, res, userId);
      case 'DELETE':
        return DELETE(req, res, userId);
      default:
        return res
          .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
          .json({ error: 'Phương thức không được hỗ trợ' });
    }
  } catch (error: any) {
    return res.status(RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
}

// Get all categories
export async function GET(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const categories = await categoryUseCase.getCategories(userId);
    return res.status(RESPONSE_CODE.OK).json({ categories });
  } catch (error: any) {
    res.status(error.status || RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}

// Create a new category
export async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { type, icon, name, description, parentId } = req.body;
    const newCategory = await categoryUseCase.createCategory({
      userId,
      type: type as CategoryType,
      icon,
      name,
      description,
      parentId,
    });
    return res.status(RESPONSE_CODE.CREATED).json({
      message: 'Tạo danh mục thành công',
      category: newCategory,
    });
  } catch (error: any) {
    res.status(error.status || RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}

// Update category by id
export async function PUT(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { id, type, icon, name, description, parentId } = req.body;
    const updatedCategory = await categoryUseCase.updateCategory(id, userId, {
      type: type as CategoryType,
      icon,
      name,
      description,
      parentId,
    });
    return res.status(RESPONSE_CODE.OK).json({
      message: 'Cập nhật danh mục thành công',
      category: updatedCategory,
    });
  } catch (error: any) {
    res.status(error.status || RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}

// Delete category by id
export async function DELETE(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { id } = req.query;
    await categoryUseCase.deleteCategory(id as string, userId);
    return res.status(RESPONSE_CODE.OK).json({ message: 'Xóa danh mục thành công' });
  } catch (error: any) {
    res.status(error.status || RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}
