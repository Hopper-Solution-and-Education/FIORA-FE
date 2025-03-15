import { CategoryType } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { categoryUseCase } from '@/features/setting/application/use-cases/categoryUseCase';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { authOptions } from '../auth/[...nextauth]';
import { createErrorResponse, createResponse } from '@/lib/utils';
import { Messages } from '@/config/message';

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
      case 'PUT':
        return PUT(req, res, userId);
      case 'DELETE':
        return DELETE(req, res, userId);
      default:
        return res
          .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
          .json(createErrorResponse(RESPONSE_CODE.METHOD_NOT_ALLOWED, Messages.METHOD_NOT_ALLOWED));
    }
  } catch (error: any) {
    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(
        createErrorResponse(
          RESPONSE_CODE.INTERNAL_SERVER_ERROR,
          error.message || Messages.INTERNAL_ERROR,
        ),
      );
  }
}

export async function GET(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const categories = await categoryUseCase.getCategories(userId);
    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, 'success', categories, Messages.GET_CATEGORY_SUCCESS));
  } catch (error: any) {
    res
      .status(error.status || RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(
        createErrorResponse(
          RESPONSE_CODE.INTERNAL_SERVER_ERROR,
          error.message || Messages.INTERNAL_ERROR,
        ),
      );
  }
}

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
    return res
      .status(RESPONSE_CODE.CREATED)
      .json(
        createResponse(
          RESPONSE_CODE.CREATED,
          'success',
          newCategory,
          Messages.CREATE_CATEGORY_SUCCESS,
        ),
      );
  } catch (error: any) {
    res
      .status(error.status || RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(
        createErrorResponse(
          RESPONSE_CODE.INTERNAL_SERVER_ERROR,
          error.message || Messages.INTERNAL_ERROR,
        ),
      );
  }
}

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
    return res
      .status(RESPONSE_CODE.OK)
      .json(
        createResponse(
          RESPONSE_CODE.OK,
          'success',
          updatedCategory,
          Messages.UPDATE_CATEGORY_SUCCESS,
        ),
      );
  } catch (error: any) {
    res
      .status(error.status || RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(
        createErrorResponse(
          RESPONSE_CODE.INTERNAL_SERVER_ERROR,
          error.message || Messages.INTERNAL_ERROR,
        ),
      );
  }
}

export async function DELETE(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { id } = req.query;
    await categoryUseCase.deleteCategory(id as string, userId);
    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, 'success', null, Messages.DELETE_CATEGORY_SUCCESS));
  } catch (error: any) {
    res
      .status(error.status || RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(
        createErrorResponse(
          RESPONSE_CODE.INTERNAL_SERVER_ERROR,
          error.message || Messages.INTERNAL_ERROR,
        ),
      );
  }
}
