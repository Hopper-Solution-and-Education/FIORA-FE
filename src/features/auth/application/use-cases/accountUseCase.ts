import { Account, AccountType, Currency, Prisma } from '@prisma/client';
import { IAccountRepository } from '../../domain/repositories/accountRepository.interface';
import { Decimal } from '@prisma/client/runtime/library';
import { accountRepository } from '../../infrastructure/repositories/accountRepository';

const descriptions = {
  ['Payment']:
    'Đây là loại tài khoản được thiết kế để quản lý các giao dịch tài chính hàng ngày, chẳng hạn như thanh toán hóa đơn, chuyển tiền giữa các tài khoản hoặc chi tiêu cá nhân. Nó hoạt động như một "ví điện tử" hoặc tài khoản chính để xử lý dòng tiền ra vào thường xuyên.',
  ['Debt']:
    'Tài khoản này được tạo để theo dõi các khoản vay mà bạn nhận từ người khác hoặc tổ chức (như ngân hàng). Nó không dùng cho mục đích khác ngoài việc ghi nhận và quản lý nợ.',
  ['Lending']:
    'Đây là tài khoản dùng để ghi nhận các khoản tiền bạn cho người khác vay, chẳng hạn như bạn bè, gia đình, hoặc đối tác kinh doanh. Nó theo dõi số tiền người khác nợ bạn.',
  ['Saving']:
    'Tài khoản này dành riêng cho việc tích lũy tiền tiết kiệm và theo dõi lãi suất phát sinh từ số tiền đó. Nó không dùng cho giao dịch hàng ngày mà tập trung vào mục tiêu dài hạn như tiết kiệm mua nhà, xe, hoặc dự phòng',
  ['CreditCard']:
    'Đây là loại tài khoản đại diện cho thẻ tín dụng, dùng để chi tiêu hàng ngày hoặc chuyển khoản nội bộ (giữa các tài khoản cùng hệ thống). Nó cho phép bạn "vay trước" một khoản tiền từ hạn mức tín dụng do bạn tự thiết lập.',
};

export class AccountUseCase {
  constructor(private accountRepository: IAccountRepository) {}

  async create(params: {
    userId: string;
    name: string;
    type: 'Payment' | 'Debt' | 'Lending' | 'Saving' | 'CreditCard';
    currency: Currency;
    balance: number;
    icon: string;
    parentId?: string;
    limit?: number; // For Credit Card only
  }): Promise<any> {
    const {
      name,
      type = AccountType.Payment,
      currency = 'VND',
      balance = 0,
      limit,
      icon,
      parentId = null,
      userId,
    } = params;

    if (parentId) {
      await this.validateParentAccount(parentId, type);
      const subAccount = await this.accountRepository.create({
        type,
        name,
        description: descriptions[type as keyof typeof descriptions],
        icon: icon,
        userId,
        balance,
        currency,
        limit: type === AccountType.CreditCard ? limit : new Decimal(0),
        parentId: parentId,
        createdBy: userId,
      });

      if (!subAccount) {
        throw new Error('Cannot create sub account');
      }
      const updatedParentBalance = await this.updateParentBalance(parentId, type);

      if (!updatedParentBalance) {
        throw new Error('Cannot update parent balance');
      }

      return subAccount;
    } else {
      const parentAccount = await this.accountRepository.create({
        type,
        name,
        description: descriptions[type as keyof typeof descriptions],
        icon: icon,
        userId,
        balance,
        currency,
        limit: type === AccountType.CreditCard ? limit : new Decimal(0),
        parentId: null,
        createdBy: userId,
      });

      if (!parentAccount) {
        throw new Error('Cannot create parent account');
      }
      return parentAccount;
    }
  }

  async validateParentAccount(parentId: string, type: AccountType): Promise<void> {
    const parentAccount = await this.accountRepository.findById(parentId);

    if (!parentAccount) {
      throw new Error('Parent account not found');
    }

    if (parentAccount.type !== type) {
      throw new Error('Parent account type does not match');
    }
  }

  async updateParentBalance(parentId: string, type: AccountType): Promise<boolean> {
    const subAccounts = await this.accountRepository.findMany(
      { parentId },
      { select: { balance: true, limit: true } },
    );

    if (subAccounts.length === 0) {
      return true;
    }

    // update limit & balance for CreditCard. Since balance is negative, we need to sum it up
    // and increase the limit
    if (type === AccountType.CreditCard) {
      const totalBalance = subAccounts.reduce(
        (sum, acc) => sum.plus(acc.balance || new Decimal(0)),
        new Decimal(0),
      );

      const totalLimit = subAccounts.reduce(
        (sum, acc) => sum.plus(acc.limit || new Decimal(0)),
        new Decimal(0),
      );

      // if total Limit is less than total balance

      const updateRes = await this.accountRepository.update(parentId, {
        balance: {
          increment: totalBalance,
        },
        limit: {
          increment: totalLimit,
        },
      });

      if (!updateRes) {
        throw new Error('Cannot update parent account');
      }

      return true;
    } else if (type === AccountType.Debt) {
      const totalBalance = subAccounts.reduce(
        (sum, acc) => sum.plus(acc.balance || new Decimal(0)),
        new Decimal(0),
      );

      const updateRes = await this.accountRepository.update(parentId, { balance: totalBalance });
      return !!updateRes;
    } else {
      const totalBalance = subAccounts.reduce(
        (sum, acc) => sum.plus(acc.balance || new Decimal(0)),
        new Decimal(0),
      );

      const updateRes = await this.accountRepository.update(parentId, { balance: totalBalance });
      return !!updateRes;
    }
  }

  async findById(id: string): Promise<Account | null> {
    return this.accountRepository.findById(id);
  }

  async findByCondition(where: Prisma.AccountWhereInput) {
    return this.accountRepository.findMany(where, { select: { balance: true } });
  }

  async findAll(): Promise<Account[] | []> {
    return this.accountRepository.findAll();
  }

  async isOnlyMasterAccount(id: string, type: AccountType): Promise<boolean> {
    const masterAccount = await this.accountRepository.findByCondition({
      userId: id,
      type,
      parentId: null,
    });

    return masterAccount ? true : false;
  }

  async findAllAccountByUserId(userId: string): Promise<Account[] | []> {
    return this.accountRepository.findAllAccountByUserId(userId);
  }

  async getAllParentAccount(userId: string): Promise<Account[] | []> {
    return this.accountRepository.findManyWithCondition({
      userId,
      parentId: null,
    });
  }

  async getAllAccountByUserId(userId: string): Promise<Account[] | []> {
    return this.accountRepository.findManyWithCondition(
      {
        userId,
      },
      {
        id: true,
        name: true,
        type: true,
        balance: true,
        limit: true,
        parentId: true,
        description: true,
        icon: true,
      },
    );
  }

  async fetchBalanceByUserId(userId: string): Promise<any> {
    // Fetch balance of userId by separate into 2 categories : Dept (Credit & Dept) and Balance (Payment, Lending, Saving)
    const balanceAwaited = this.accountRepository.aggregate({
      where: {
        userId,
        type: {
          in: [AccountType.Payment, AccountType.Lending, AccountType.Saving],
        },
        parentId: null,
      },
      _sum: {
        balance: true,
      },
    });

    const deptAwaited = this.accountRepository.aggregate({
      where: {
        userId,
        type: {
          in: [AccountType.Debt],
        },
        parentId: null,
      },
      _sum: {
        balance: true,
      },
    });

    const [balanceObj, deptObj] = (await Promise.all([balanceAwaited, deptAwaited])) as any;
    return { balance: balanceObj['_sum']['balance'], dept: deptObj['_sum']['balance'] };
  }

  async removeSubAccount(userId: string, parentId: string, subAccountId: string): Promise<void> {
    await this.accountRepository.delete({
      where: {
        id: subAccountId,
        userId,
        parentId: parentId,
      },
    });

    await this.accountRepository.updateParentBalance(parentId);
  }
}

export const AccountUseCaseInstance = new AccountUseCase(accountRepository);
