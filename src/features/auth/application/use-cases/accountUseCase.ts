import { ITransactionRepository } from '@/features/transaction/domain/repositories/transactionRepository.interface';
import { transactionRepository } from '@/features/transaction/infrastructure/repositories/transactionRepository';
import { Account, AccountType, Currency, Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { IAccountRepository } from '../../domain/repositories/accountRepository.interface';
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
  constructor(
    private accountRepository: IAccountRepository,
    private transactionRepository: ITransactionRepository,
  ) {}

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
        balance: new Decimal(balance),
        currency,
        limit: type === AccountType.CreditCard ? limit : new Decimal(0),
        parentId: parentId,
        createdBy: userId,
      });

      if (!subAccount) {
        throw new Error('Cannot create sub account');
      }

      return subAccount;
    } else {
      const parentAccount = await this.accountRepository.create({
        type,
        name,
        description: descriptions[type as keyof typeof descriptions],
        icon: icon,
        userId,
        balance: new Decimal(balance),
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

  async findById(id: string): Promise<Account | null> {
    return this.accountRepository.findById(id);
  }

  async findManyByCondition(where: Prisma.AccountWhereInput) {
    return this.accountRepository.findMany(where, { select: { balance: true } });
  }

  async findByCondition(where: Prisma.AccountWhereInput): Promise<Account | null> {
    return this.accountRepository.findByCondition(where);
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
        include: {
          children: true,
          toTransactions: true,
          fromTransactions: true,
        },
        orderBy: [
          {
            type: 'asc',
          },
          {
            balance: 'asc',
          },
        ],
      },
    );
  }

  async fetchBalanceByUserId(userId: string): Promise<any> {
    // Fetch balance of userId by separate into 2 categories : Dept (Credit & Dept) and Balance (Payment, Lending, Saving)
    const balanceAwaited = this.accountRepository.aggregate({
      where: {
        userId,
        type: {
          in: [AccountType.Payment, AccountType.Lending, AccountType.Saving, AccountType.Invest],
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

  async updateAccount(id: string, params: Prisma.AccountUpdateInput): Promise<Account | null> {
    // If this is a sub-account, update the parent's balance, otherwise, update the account directly
    const account = await this.accountRepository.findById(id);
    if (!account) {
      throw new Error('Account not found');
    }

    return await this.accountRepository.update(id, { ...params });
  }

  async deleteAccount(id: string, userId: string): Promise<Account | null> {
    const foundAccount = await this.accountRepository.findByCondition({
      userId,
    });

    // checked whether account is master account or not
    if (!foundAccount) {
      throw new Error('Account not found');
    }

    const isMasterAccount = foundAccount.parentId === null;

    if (isMasterAccount) {
      // checked whether any sub account is existed or not
      const subAccounts = await this.accountRepository.findMany({ parentId: id });
      if (subAccounts.length > 0) {
        throw new Error('Cannot delete master account with sub account still existed');
      } else {
        const transaction = await this.transactionRepository.findManyTransactions({
          OR: [{ fromAccountId: id }, { toAccountId: id }], // check if any transaction linked to this account
        });

        if (transaction.length > 0) {
          throw new Error('Sorry! You cannot delete Account which already has transactions');
        }

        // delete master account
        const res = await this.accountRepository.delete({
          where: {
            id,
            userId,
          },
        });

        if (!res) {
          throw new Error('Cannot delete master account');
        }

        return res;
      }
    } else {
      // checked whether any transaction linked into account
      const transaction = await this.transactionRepository.findManyTransactions({
        OR: [{ fromAccountId: id }, { toAccountId: id }],
      });

      if (transaction.length > 0) {
        throw new Error('Cannot delete account with transaction still existed');
      }
      const deletedRes = await this.accountRepository.delete({
        where: {
          id,
        },
      });

      return deletedRes;
    }
  }

  public validateAccountType(type: AccountType, balance: number, limit?: number): boolean {
    if (!Object.values(AccountType).includes(type)) {
      return false;
    }

    switch (type) {
      case AccountType.Payment:
      case AccountType.Saving:
      case AccountType.Lending:
      case AccountType.Invest:
        if (balance < 0) {
          throw new Error('Balance must be >= 0');
        }
        break;
      case AccountType.Debt:
        if (balance > 0) {
          throw new Error('Balance must be <= 0');
        }
        break;
      case AccountType.CreditCard:
        if (!limit && limit !== 0) {
          throw new Error('Limit must be provided');
        }

        if (balance > 0) {
          throw new Error('Balance must be <= 0');
        }

        if (limit < 0) {
          throw new Error('Limit must be >= 0');
        }

        if (limit < balance) {
          throw new Error('Limit must be greater than balance');
        }
        break;
    }
    return true;
  }
}

export const AccountUseCaseInstance = new AccountUseCase(accountRepository, transactionRepository);
