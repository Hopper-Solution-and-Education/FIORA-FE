import { prisma } from '@/config';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { Currency } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default sessionWrapper(async (req, res, userId) => {
  switch (req.method) {
    case 'GET':
      return GET(req, res, userId);
    default:
      return res
        .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
        .json({ error: 'Phương thức không được hỗ trợ' });
  }
});

async function GET(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { page = 1, pageSize = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);

    // Bước 1: Lấy danh sách CategoryProducts phân trang
    const categoriesAwaited = prisma.categoryProducts.findMany({
      where: { userId },
      skip,
      take,
      select: {
        id: true,
        name: true,
        description: true,
        icon: true,
        tax_rate: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { name: 'asc' }, // Sắp xếp theo tên danh mục, có thể thay đổi
    });

    // Bước 2: Đếm tổng số CategoryProducts
    const countAwaited = prisma.categoryProducts.count({
      where: { userId },
    });

    const [categories, count] = await Promise.all([categoriesAwaited, countAwaited]);

    // Bước 3: Lấy tất cả catId từ danh mục
    const catIds = categories.map((cat) => cat.id);

    // Bước 4: Lấy tất cả sản phẩm thuộc các danh mục này
    const products = await prisma.product.findMany({
      where: {
        catId: { in: catIds },
        userId, // Đảm bảo sản phẩm thuộc về user
      },
      select: {
        id: true,
        price: true,
        name: true,
        type: true,
        description: true,
        taxRate: true,
        catId: true,
        icon: true,
        currency: true,
        items: {
          select: {
            id: true,
            name: true,
            description: true,
            icon: true,
          },
        },
      },
    });

    // Bước 5: Lấy tất cả ProductTransaction liên quan đến các sản phẩm
    const productIds = products.map((product) => product.id);
    const productTransactions = await prisma.productTransaction.findMany({
      where: {
        productId: { in: productIds },
        transaction: { userId }, // Lọc theo userId của Transaction
      },
      select: {
        productId: true,
        transaction: {
          select: {
            id: true,
            userId: true,
            type: true,
            amount: true,
            currency: true,
          },
        },
      },
    });

    // Bước 6: Gộp dữ liệu
    // Tạo map cho ProductTransaction theo productId
    const productTransactionMap = productTransactions.reduce(
      (acc, pt) => {
        if (!acc[pt.productId]) {
          acc[pt.productId] = [];
        }
        acc[pt.productId].push({
          id: pt.transaction.id,
          userId: pt.transaction.userId,
          type: pt.transaction.type,
          amount: pt.transaction.amount.toNumber(),
          currency: pt.transaction.currency,
        });
        return acc;
      },
      {} as Record<
        string,
        Array<{
          id: string;
          userId: string | null;
          type: string;
          amount: number;
          currency: Currency;
        }>
      >,
    );

    // Gộp sản phẩm theo danh mục
    const productsByCategory = products.reduce(
      (acc, product) => {
        const catId = product.catId;
        if (catId) {
          // Chỉ xử lý nếu catId không null
          if (!acc[catId]) {
            acc[catId] = [];
          }
          const transactions = productTransactionMap[product.id] || [];
          acc[catId].push({
            product: {
              id: product.id,
              price: product.price,
              name: product.name,
              type: product.type,
              description: product.description,
              items: product.items,
              taxRate: product.taxRate,
              catId: product.catId,
              icon: product.icon,
              currency: product.currency,
            },
            transactions,
          });
        }
        return acc;
      },
      {} as Record<string, Array<{ product: any; transactions: any | null }>>,
    );

    // Bước 7: Tạo dữ liệu trả về
    const transformedData = categories.map((category) => ({
      category: {
        id: category.id,
        name: category.name,
        description: category.description,
        icon: category.icon,
        tax_rate: category.tax_rate,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      },
      products: productsByCategory[category.id] || [],
    }));

    // Bước 8: Tính tổng số trang
    const totalPage = Math.ceil(count / take);

    // Trả về phản hồi
    return res.status(RESPONSE_CODE.OK).json(
      createResponse(RESPONSE_CODE.OK, 'Fetched product categories successfully', {
        data: transformedData,
        page: Number(page),
        pageSize: Number(pageSize),
        totalPage,
      }),
    );
  } catch (error: any) {
    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(
        createResponse(
          RESPONSE_CODE.INTERNAL_SERVER_ERROR,
          error.message || Messages.INTERNAL_ERROR,
        ),
      );
  }
}
