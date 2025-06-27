import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { getFaqCategoriesUseCase } from '@/features/faqs/di/container';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({
        message: 'Unauthorized',
        data: null,
        status: 401,
      });
    }

    // Only allow GET method
    if (req.method !== 'GET') {
      return res.status(405).json({
        message: 'Method not allowed',
        data: null,
        status: 405,
      });
    }

    try {
      // Use the getFaqCategoriesUseCase to fetch categories from the database
      const categories = await getFaqCategoriesUseCase.execute();

      // Return response
      return res.status(200).json({
        message: 'FAQ categories retrieved successfully',
        data: categories,
        status: 200,
      });
    } catch (error) {
      console.error('Error fetching FAQ categories from database:', error);

      // Return empty array in case of error
      return res.status(200).json({
        message: 'Failed to retrieve FAQ categories, returning empty list',
        data: [],
        status: 200,
      });
    }
  } catch (error) {
    console.error('Error in categories API handler:', error);
    return res.status(500).json({
      message: 'Failed to process request',
      data: null,
      status: 500,
    });
  }
}
