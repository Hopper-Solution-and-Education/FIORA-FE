// import { NextApiRequest, NextApiResponse } from 'next';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '../auth/[...nextauth]';
// import { getFaqsListUseCase } from '@/features/faqs/di/container';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   try {
//     // Check if user is authenticated
//     const session = await getServerSession(req, res, authOptions);
//     if (!session) {
//       return res.status(401).json({
//         message: 'Unauthorized',
//         data: null,
//         status: 401,
//       });
//     }

//     // Only allow GET method
//     if (req.method !== 'GET') {
//       return res.status(405).json({
//         message: 'Method not allowed',
//         data: null,
//         status: 405,
//       });
//     }

//     // Extract query parameters
//     const page = parseInt(req.query.page as string) || 1;
//     const pageSize = parseInt(req.query.pageSize as string) || 10;
//     const category = req.query.category as string;
//     const type = req.query.type as string;
//     const search = req.query.search as string;

//     try {
//       // Use the getFaqsListUseCase to fetch FAQs from the database
//       const faqsListResponse = await getFaqsListUseCase.execute(
//         {
//           page,
//           pageSize,
//           category,
//           type,
//           search,
//         },
//         session.user.id,
//       );

//       // Return response
//       return res.status(200).json({
//         message: 'FAQs retrieved successfully',
//         data: faqsListResponse,
//         status: 200,
//       });
//     } catch (error) {
//       console.error('Error fetching FAQs from database:', error);

//       // Fallback to mock data in case of database error
//       console.log('Falling back to mock data');

//       // Filter and paginate mock faqs
//       let filteredFaqs = [...mockFaqs];

//       // Apply filters
//       if (category) {
//         filteredFaqs = filteredFaqs.filter((faq) => faq.category === category);
//       }

//       if (type) {
//         filteredFaqs = filteredFaqs.filter((faq) => faq.type === type);
//       }

//       if (search) {
//         const searchLower = search.toLowerCase();
//         filteredFaqs = filteredFaqs.filter(
//           (faq) =>
//             faq.title.toLowerCase().includes(searchLower) ||
//             faq.description.toLowerCase().includes(searchLower) ||
//             faq.content.toLowerCase().includes(searchLower),
//         );
//       }

//       // Calculate pagination
//       const totalCount = filteredFaqs.length;
//       const totalPages = Math.ceil(totalCount / pageSize);
//       const startIndex = (page - 1) * pageSize;
//       const paginatedFaqs = filteredFaqs.slice(startIndex, startIndex + pageSize);

//       return res.status(200).json({
//         message: 'FAQs retrieved from mock data (database error)',
//         data: {
//           faqs: paginatedFaqs,
//           totalCount,
//           currentPage: page,
//           pageSize,
//           totalPages,
//         },
//         status: 200,
//       });
//     }
//   } catch (error) {
//     console.error('Error fetching FAQs:', error);
//     return res.status(500).json({
//       message: 'Failed to retrieve FAQs',
//       data: null,
//       status: 500,
//     });
//   }
// }
