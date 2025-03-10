import { TransactionType } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { transactionUseCase } from '@/features/transaction/application/use-cases/transactionUseCase';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { authOptions } from '../auth/[...nextauth]';
import { UUID } from 'crypto';

// Hàm kiểm tra session
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

// Handler chính
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

// Lấy danh sách giao dịch
export async function GET(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const transactions = await transactionUseCase.listTransactions(userId);
    return res.status(RESPONSE_CODE.OK).json({
      message: 'Lấy danh sách giao dịch thành công',
      data: transactions,
    });
  } catch (error: any) {
    res.status(error.status || RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}

// Tạo giao dịch mới (Expense)
export async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { accountId, toCategoryId, amount, products, partnerId, remark, date } = req.body;

    const transactionData = {
      userId: userId,
      type: TransactionType.Expense,
      amount: parseFloat(amount),
      accountId: accountId as UUID,
      toCategoryId: toCategoryId,
      ...(products && { products }),
      ...(partnerId && { partnerId }),
      ...(remark && { remark }),
      ...(date && { date: new Date(date) }),
    };

    const newTransaction = await transactionUseCase.createTransaction_Expense(transactionData);

    return res.status(RESPONSE_CODE.CREATED).json({
      message: 'Tạo giao dịch chi tiêu thành công',
      transaction: newTransaction,
    });
  } catch (error: any) {
    res.status(error.status || RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}

// Cập nhật giao dịch
export async function PUT(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { id, transaction } = req.body;
    const updatedTransaction = await transactionUseCase.editTransaction(id, userId, transaction);
    return res.status(RESPONSE_CODE.OK).json({
      message: 'Cập nhật giao dịch thành công',
      transaction: updatedTransaction,
    });
  } catch (error: any) {
    res.status(error.status || RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}

// Xóa giao dịch
export async function DELETE(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { id } = req.query;
    await transactionUseCase.removeTransaction(id as string, userId);
    return res.status(RESPONSE_CODE.OK).json({ message: 'Xóa giao dịch thành công' });
  } catch (error: any) {
    res.status(error.status || RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}
