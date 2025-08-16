import { prisma } from '@/config';
import { ITransactionRepository } from '@/features/transaction/domain/repositories/transactionRepository.interface';
import { transactionRepository } from '@/features/transaction/infrastructure/repositories/transactionRepository';
import { Messages } from '@/shared/constants/message';
import { BadRequestError, BooleanUtils } from '@/shared/lib';
import { GlobalFilters } from '@/shared/types';
import { PartnerRangeFilter } from '@/shared/types/partner.types';
import { buildWhereClause } from '@/shared/utils';
import { sanitizeDateFilters } from '@/shared/utils/common';
import { safeString } from '@/shared/utils/ExStringUtils';
import { searchWithUnaccentFallback } from '@/shared/utils/unaccent-search.util';
import { type Partner, type Prisma, Transaction, TransactionType } from '@prisma/client';
import { IPartnerRepository } from '../../domain/repositories/partnerRepository.interface';
import { PartnerValidationData } from '../../exception/partnerException.type';
import { validatePartnerData } from '../../exception/partnerExceptionHandler';
import { partnerRepository } from '../../infrastructure/repositories/partnerRepository';

class PartnerUseCase {
  constructor(
    private partnerRepository: IPartnerRepository,
    private transactionRepository: ITransactionRepository,
  ) {}

  async listPartners(userId: string): Promise<Partner[]> {
    return this.partnerRepository.getPartnersByUserId(userId);
  }

  async viewPartner(id: string, userId: string): Promise<Partner> {
    const partner = await this.partnerRepository.getPartnerById(id, userId);
    if (!partner) {
      throw new Error(Messages.PARTNER_NOT_FOUND);
    }
    return partner;
  }

  private determinePartnerType(transactions: Transaction[]): string {
    const hasIncomeType = transactions.some((t) => t.type === TransactionType.Income);
    const hasExpenseType = transactions.some((t) => t.type === TransactionType.Expense);

    if (hasIncomeType) {
      return 'Supplier';
    } else if (hasExpenseType) {
      return 'Customer';
    } else {
      return 'Unknown';
    }
  }

  async filterPartnerOptions(params: GlobalFilters, userId: string) {
    const searchParams = safeString(params.search);
    let filters = params.filters || {};
    const typesFilter = params.types || [];

    filters = sanitizeDateFilters(params.filters || {});
    const where = buildWhereClause(filters) as Prisma.PartnerWhereInput;
    let partners;
    if (BooleanUtils.isTrue(searchParams)) {
      try {
        const rawPartners = await searchWithUnaccentFallback('Partner', userId, searchParams, [
          'name',
          'identify',
          'taxNo',
          'phone',
          'email',
          'address',
        ]);

        partners = await Promise.all(
          rawPartners.map(async (partner: any) => {
            const [transactions, children, parent] = await Promise.all([
              prisma.transaction.findMany({
                where: {
                  isDeleted: false,
                  OR: [{ partnerId: partner.id }],
                },
              }),
              prisma.partner.findMany({ where: { parentId: partner.parentId } }),
              prisma.partner.findFirst({ where: { id: partner.id } }),
            ]);
            return { ...partner, transactions, children, parent };
          }),
        );
      } catch (error) {
        console.error('Unaccent search for Partner failed:', error);
        partners = [];
      }
    } else {
      partners = await this.partnerRepository.findManyPartner(
        {
          ...where,
          userId,
        },
        {
          include: {
            transactions: {
              where: { isDeleted: false },
            },
            children: true,
            parent: true,
          },
          orderBy: { transactions: { _count: 'desc' } },
        },
      );
    }

    const transactionRangeFilters = this.extractTransactionRangeFilters(filters);
    const filteredPartners = await this.filterByTransactionRange(partners, transactionRangeFilters);

    const finalFilteredPartners =
      typesFilter.length > 0
        ? filteredPartners.filter((partner: any) => {
            const type = this.determinePartnerType(partner.transactions || []);
            return typesFilter.includes(type);
          })
        : filteredPartners;

    const { minIncome, maxIncome, minExpense, maxExpense } =
      this.calculateTransactionStats(finalFilteredPartners);

    return {
      data: finalFilteredPartners,
      minIncome,
      maxIncome,
      minExpense,
      maxExpense,
    };
  }

  async filterByTransactionRange(partners: Array<any>, filters: PartnerRangeFilter) {
    const {
      totalIncomeMin = 0,
      totalIncomeMax = Number.MAX_SAFE_INTEGER,
      totalExpenseMin = 0,
      totalExpenseMax = Number.MAX_SAFE_INTEGER,
    } = filters;

    return partners.filter((partner) => {
      const totalExpense = partner.transactions
        .filter((t: Transaction) => t.type === 'Expense')
        .reduce((sum: number, t: Transaction) => sum + Number(t.amount), 0);

      const totalIncome = partner.transactions
        .filter((t: Transaction) => t.type === 'Income')
        .reduce((sum: number, t: Transaction) => sum + Number(t.amount), 0);

      const isValidExpense = totalExpense >= totalExpenseMin && totalExpense <= totalExpenseMax;
      const isValidIncome = totalIncome >= totalIncomeMin && totalIncome <= totalIncomeMax;

      return isValidExpense || isValidIncome;
    });
  }

  private extractTransactionRangeFilters(filters: any): PartnerRangeFilter {
    const transactionFilters = filters.transactions?.some?.OR || [];

    const rangeFilters = {
      totalIncomeMin: 0,
      totalIncomeMax: Number.MAX_SAFE_INTEGER,
      totalExpenseMin: 0,
      totalExpenseMax: Number.MAX_SAFE_INTEGER,
    };

    for (const condition of transactionFilters) {
      if (condition.type === 'Income' && condition.amount) {
        if (condition.amount.gte !== undefined) {
          rangeFilters.totalIncomeMin = condition.amount.gte;
        }
        if (condition.amount.lte !== undefined) {
          rangeFilters.totalIncomeMax = condition.amount.lte;
        }
      }

      if (condition.type === 'Expense' && condition.amount) {
        if (condition.amount.gte !== undefined) {
          rangeFilters.totalExpenseMin = condition.amount.gte;
        }
        if (condition.amount.lte !== undefined) {
          rangeFilters.totalExpenseMax = condition.amount.lte;
        }
      }
    }

    return rangeFilters;
  }

  private calculateTransactionStats(partners: Array<any>) {
    let minIncome = Number.MAX_SAFE_INTEGER;
    let maxIncome = 0;
    let minExpense = Number.MAX_SAFE_INTEGER;
    let maxExpense = 0;

    for (const partner of partners) {
      const incomeTransactions =
        partner.transactions?.filter((t: Transaction) => t.type === 'Income') ?? [];
      const expenseTransactions =
        partner.transactions?.filter((t: Transaction) => t.type === 'Expense') ?? [];

      if (incomeTransactions.length > 0) {
        const partnerMinIncome = Math.min(...incomeTransactions.map((t: any) => Number(t.amount)));
        const partnerMaxIncome = Math.max(...incomeTransactions.map((t: any) => Number(t.amount)));
        minIncome = Math.min(minIncome, partnerMinIncome);
        maxIncome = Math.max(maxIncome, partnerMaxIncome);
      }

      if (expenseTransactions.length > 0) {
        const partnerMinExpense = Math.min(
          ...expenseTransactions.map((t: any) => Number(t.amount)),
        );
        const partnerMaxExpense = Math.max(
          ...expenseTransactions.map((t: any) => Number(t.amount)),
        );
        minExpense = Math.min(minExpense, partnerMinExpense);
        maxExpense = Math.max(maxExpense, partnerMaxExpense);
      }
    }

    return {
      minIncome: minIncome === Number.MAX_SAFE_INTEGER ? 0 : minIncome,
      maxIncome,
      minExpense: minExpense === Number.MAX_SAFE_INTEGER ? 0 : minExpense,
      maxExpense,
    };
  }

  async deletePartner(id: string, userId: string, newId?: string): Promise<void> {
    const partner = await this.partnerRepository.getPartnerById(id, userId);
    if (!partner) {
      throw new Error(Messages.PARTNER_NOT_FOUND);
    }

    if (newId) {
      const newPartner = await this.partnerRepository.getPartnerById(newId, userId);
      if (!newPartner) {
        throw new Error(Messages.PARTNER_NOT_FOUND);
      }

      await this.transactionRepository.updateTransactionsPartner(id, newId);
    }

    await this.partnerRepository.deletePartner(id);
  }

  async editPartner(
    id: string,
    userId: string,
    data: Prisma.PartnerUncheckedUpdateInput,
  ): Promise<Partner> {
    return prisma.$transaction(async (tx) => {
      const partner = await tx.partner.findUnique({
        where: { id, userId },
      });
      if (!partner) {
        throw new BadRequestError(Messages.PARTNER_NOT_FOUND);
      }

      const validationData: PartnerValidationData = {
        userId: userId,
        email: data.email as string | null,
        phone: data.phone as string | null,
        taxNo: data.taxNo as string | null,
        identify: data.identify as string | null,
        name: data.name as string,
        description: data.description as string | null,
        address: data.address as string | null,
        logo: data.logo as string | null,
        dob: data.dob ? new Date(data.dob as string | Date) : null,
        parentId: data.parentId as string | null,
        id: id,
      };

      const validationErrors = await validatePartnerData(validationData, tx, true);

      if (validationErrors.length > 0) {
        const errorObject: Record<string, string> = {};
        validationErrors.forEach((err) => {
          errorObject[err.field] = err.message;
        });
        throw { validationErrors: errorObject };
      }

      if (data.parentId) {
        const parentPartner = await tx.partner.findUnique({
          where: { id: data.parentId as string },
          include: { children: true },
        });
        if (!parentPartner) {
          throw new Error(Messages.PARENT_PARTNER_NOT_FOUND);
        }
        if (parentPartner.id === partner.id) {
          throw new Error(Messages.INVALID_PARENT_PARTNER_SELF);
        }
      }

      const updateData = {
        email: data.email,
        identify: data.identify,
        description: data.description,
        dob: data.dob ? new Date(data.dob as string) : undefined,
        logo: data.logo,
        bankAccount: data.bankAccount,
        taxNo: data.taxNo,
        phone: data.phone,
        name: data.name,
        address: data.address,
        parentId: data.parentId,
        updatedBy: data.userId || userId,
      };

      const updatedPartner = await tx.partner.update({
        where: { id, userId },
        data: updateData,
      });
      if (!updatedPartner) {
        throw new Error(Messages.UPDATE_PARTNER_FAILED);
      }

      return updatedPartner;
    });
  }

  async createPartner(data: Prisma.PartnerUncheckedCreateInput): Promise<Partner> {
    return prisma.$transaction(async (tx) => {
      const validationData: PartnerValidationData = {
        userId: data.userId as string,
        email: data.email as string | null,
        phone: data.phone as string | null,
        taxNo: data.taxNo as string | null,
        identify: data.identify as string | null,
        name: data.name as string,
        description: data.description as string | null,
        address: data.address as string | null,
        logo: data.logo as string | null,
        dob: data.dob ? new Date(data.dob as string | Date) : null,
        parentId: data.parentId as string | null,
      };

      const validationErrors = await validatePartnerData(validationData, tx, false);

      if (validationErrors.length > 0) {
        const errorObject: Record<string, string> = {};
        validationErrors.forEach((err) => {
          errorObject[err.field] = err.message;
        });
        throw { validationErrors: errorObject };
      }

      const partner = await tx.partner.create({
        data: {
          userId: data.userId as string,
          email: data.email,
          identify: data.identify,
          description: data.description,
          bankAccount: data.bankAccount,
          dob: data.dob,
          logo: data.logo,
          taxNo: data.taxNo,
          phone: data.phone,
          name: data.name,
          address: data.address,
          createdBy: data.userId as string,
          updatedBy: data.userId as string,
          parentId: data.parentId || null,
        },
      });

      if (!partner) {
        throw new Error(Messages.CREATE_PARTNER_FAILED);
      }

      return partner;
    });
  }

  async getPartnerById(id: string, userId: string) {
    try {
      const partner = await this.partnerRepository.getPartnerById(id, userId);

      if (!partner) {
        throw new Error(Messages.PARTNER_NOT_FOUND);
      }

      const [createdBy, updatedBy] = await Promise.all([
        partner.createdBy
          ? prisma.user.findFirst({
              where: { id: partner.createdBy },
              select: { id: true, name: true, email: true, image: true },
            })
          : null,
        partner.updatedBy
          ? prisma.user.findFirst({
              where: { id: partner.updatedBy },
              select: { id: true, name: true, email: true, image: true },
            })
          : null,
      ]);

      return {
        ...partner,
        createdBy: createdBy || null,
        updatedBy: updatedBy || null,
      };
    } catch (error) {
      console.error('Error getting partner by ID:', error);
      throw error;
    }
  }
}

export const partnerUseCase = new PartnerUseCase(partnerRepository, transactionRepository);
