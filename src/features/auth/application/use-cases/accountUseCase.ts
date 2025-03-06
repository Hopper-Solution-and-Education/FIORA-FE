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
      parentId,
      userId,
    } = params;

    const accountFound = await this.accountRepository.findByCondition({
      type,
      parentId: null,
      userId,
    });

    if (accountFound) {
      return {
        message: 'Master account already exists',
      };
    }

    if (parentId) {
      await this.validateParentAccount(parentId, type);
      const subAaccount = await this.accountRepository.create({
        type,
        name,
        description: descriptions[type as keyof typeof descriptions],
        icon: icon,
        userId,
        balance,
        currency,
        limit: type === AccountType.CreditCard ? limit : new Decimal(0),
        parentId: parentId,
      });
      await this.updateParentBalance(parentId);

      return subAaccount;
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
      });
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

  async updateParentBalance(parentId: string): Promise<void> {
    const subAccounts = await this.accountRepository.findMany(
      { parentId },
      { select: { balance: true } },
    );

    if (subAccounts.length === 0) {
      return;
    }
    const totalBalance = subAccounts.reduce(
      (sum, acc) => sum.plus(acc.balance || new Decimal(0)),
      new Decimal(0),
    );

    await this.accountRepository.update(parentId, { balance: totalBalance });
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
    });

    return masterAccount ? true : false;
  }

  async findAllAccountByUserId(userId: string): Promise<Account[] | []> {
    return this.accountRepository.findAllAccountByUserId(userId);
  }

  async getAllParentAccount(userId: string): Promise<Account[] | []> {
    return this.accountRepository.findManyWithCondition(
      {
        AND: {
          userId,
          parentId: null,
        },
      },
      {
        id: true,
        name: true,
        type: true,
        balance: true,
        limit: true,
        parentId: true,
      },
    );
  }
}

export const AccountUseCaseInstance = new AccountUseCase(accountRepository);
