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

    // Bước 1: Lấy danh sách CategoryProducts phân trang và đếm tổng số
    const [categories, count] = await Promise.all([
      prisma.categoryProducts.findMany({
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
          createdBy: true, // Chỉ cần lấy ID
          updatedBy: true, // Chỉ cần lấy ID
        },
        orderBy: { name: 'asc' }, // Sắp xếp theo tên danh mục, có thể thay đổi
      }),
      prisma.categoryProducts.count({
        where: { userId },
      }),
    ]);

    // Bước 2: Lấy tất cả catId từ danh mục
    const catIds = categories.map((cat) => cat.id);

    // Bước 3: Lấy tất cả sản phẩm thuộc các danh mục này
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

    // Bước 4: Lấy tất cả ProductTransaction liên quan đến các sản phẩm
    const productIds = products.map((product) => product.id);
    // Chỉ truy vấn nếu có sản phẩm để tránh lỗi với mảng productIds rỗng
    const productTransactions =
      productIds.length > 0
        ? await prisma.productTransaction.findMany({
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
                  amount: true, // amount là Decimal
                  currency: true,
                },
              },
            },
          })
        : [];

    // Bước 5: Lấy thông tin của createdBy và updatedBy
    const creatorIds = categories
      .map((cat) => cat.createdBy)
      .filter((id) => id !== null) as string[];
    const updatorIds = categories
      .map((cat) => cat.updatedBy)
      .filter((id) => id !== null) as string[];
    const uniqueUserIds = Array.from(new Set([...creatorIds, ...updatorIds]));

    // Chỉ truy vấn user nếu có IDs để tránh lỗi với mảng uniqueUserIds rỗng
    const users =
      uniqueUserIds.length > 0
        ? await prisma.user.findMany({
            where: { id: { in: uniqueUserIds } },
            select: { id: true, name: true, email: true, image: true },
          })
        : [];

    // Tạo map lookup cho người dùng
    const userMap = users.reduce(
      (acc, user) => {
        acc[user.id] = user;
        return acc;
      },
      {} as Record<
        string,
        { id: string; name: string | null; email: string | null; image: string | null }
      >,
    );

    // Bước 6: Gộp dữ liệu (ProductTransactionMap và ProductsByCategory)
    // Tạo map cho ProductTransaction theo productId
    const productTransactionMap = productTransactions.reduce(
      (acc, pt) => {
        if (!acc[pt.productId]) {
          acc[pt.productId] = [];
        }
        // Chuyển amount từ Decimal sang number (hoặc string tùy ý bạn)
        acc[pt.productId].push({
          id: pt.transaction.id,
          userId: pt.transaction.userId,
          type: pt.transaction.type,
          amount: pt.transaction.amount.toNumber(), // Convert Decimal to Number
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
          amount: number; // Type is now number after conversion
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
              price: product.price.toNumber(), // Convert Decimal to Number
              name: product.name,
              type: product.type,
              description: product.description,
              items: product.items,
              taxRate: product.taxRate?.toNumber() || 0, // Convert Decimal to Number
              catId: product.catId,
              icon: product.icon,
              currency: product.currency,
            },
            transactions,
          });
        }
        return acc;
      },
      {} as Record<string, Array<{ product: any; transactions: any | null }>>, // Bạn nên định nghĩa type chi tiết hơn cho product và transactions ở đây
    );

    // Bước 7: Tạo dữ liệu trả về (Sử dụng map lookup cho người dùng)
    const transformedData = categories.map((category) => {
      const createdBy = category.createdBy ? userMap[category.createdBy] || null : null;
      const updatedBy = category.updatedBy ? userMap[category.updatedBy] || null : null;

      return {
        category: {
          id: category.id,
          name: category.name,
          description: category.description,
          icon: category.icon,
          tax_rate: category.tax_rate?.toNumber() || 0, // Convert Decimal to Number
          createdAt: category.createdAt,
          updatedAt: category.updatedAt,
          createdBy: createdBy, // Lấy từ map
          updatedBy: updatedBy, // Lấy từ map
        },
        products: productsByCategory[category.id] || [],
      };
    });

    // Bước 8: Tính tổng số trang
    const totalPage = Math.ceil(count / take);

    // Trả về phản hồi
    return res.status(RESPONSE_CODE.OK).json(
      createResponse(RESPONSE_CODE.OK, 'Fetched product categories successfully', {
        data: transformedData, // transformedData giờ đã là mảng các đối tượng đã giải quyết
        page: Number(page),
        pageSize: Number(pageSize),
        totalPage,
        totalCount: count, // Thường thêm totalCount vào response
      }),
    );
  } catch (error: any) {
    console.error('Error fetching product categories:', error); // Log lỗi chi tiết hơn
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
