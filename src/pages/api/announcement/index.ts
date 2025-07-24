import { prisma } from '@/config';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

export const maxDuration = 30; // 30 seconds

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        return GET(req, res);
      case 'PUT':
        return withAuthorization({ PUT: ['Admin'] })(PUT)(req, res);

      default:
        return res
          .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
          .json({ error: 'Method is not allowed' });
    }
  } catch (error: any) {
    return res.status(RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
}

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { sentAt: 'desc' },
    });
    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, 'Get announcements successfully', announcements));
  } catch (error: any) {
    return res.status(RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}

export async function PUT(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const body = req.body;
    if (Array.isArray(body)) {
      const results = [];
      for (const item of body) {
        const { id, title, content, isActive } = item;
        const data: any = {
          title,
          content,
          isActive: isActive !== undefined ? isActive : true,
          updatedBy: userId,
          updatedAt: new Date(),
        };
        try {
          let result;
          if (id) {
            result = await prisma.announcement.update({
              where: { id },
              data,
            });
          } else {
            data.createdBy = userId;
            result = await prisma.announcement.create({
              data,
            });
          }
          results.push(result);
        } catch (error: any) {
          console.log(error);
        }
      }
      return res
        .status(RESPONSE_CODE.OK)
        .json(createResponse(RESPONSE_CODE.OK, 'Update announcement successfully', results));
    } else {
      const { id, title, content, isActive } = body;
      const data: any = {
        title,
        content,
        isActive: isActive !== undefined ? isActive : true,
        updatedBy: userId,
        updatedAt: new Date(),
      };
      try {
        let result;
        if (id) {
          result = await prisma.announcement.update({
            where: { id },
            data,
          });
        } else {
          data.createdBy = userId;
          result = await prisma.announcement.create({
            data,
          });
        }
        return res
          .status(RESPONSE_CODE.OK)
          .json(createResponse(RESPONSE_CODE.OK, 'Update announcement successfully', result));
      } catch (error: any) {
        if (error.code === 'P2025') {
          return res.status(RESPONSE_CODE.NOT_FOUND).json({ error: 'Announcement not found' });
        }
        return res.status(RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ error: error.message });
      }
    }
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(RESPONSE_CODE.NOT_FOUND).json({ error: 'Announcement not found' });
    }
    return res.status(RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}
