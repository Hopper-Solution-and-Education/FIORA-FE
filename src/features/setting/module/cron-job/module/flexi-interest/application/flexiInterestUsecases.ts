import { IFlexiInterestRepository } from '../domain/repositories/flexiInterestRepositories.Interface';
import { FlexiInterestRepositories } from '../infrastructure/repositories/flexiInterestRepositories';

class FlexiInterestUsecases {
  constructor(private _flexiInterestRepo: IFlexiInterestRepository = FlexiInterestRepositories) {}
  async getFlexiInterestPaginated({
    page = 1,
    pageSize = 20,
    filter = {},
    search = '',
  }: {
    page?: number;
    pageSize?: number;
    filter?: Record<string, any>;
    search?: string;
  }) {
    const { items, total, totalSuccess, totalFailed } =
      await this._flexiInterestRepo.getFlexiInterestPaginated(page, pageSize, filter, search);
    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      totalSuccess,
      totalFailed,
    };
  }

  async getFlexiInterestStatistics() {
    try {
      const data = await this._flexiInterestRepo.getFlexiInterestStatistics();

      if (!data || !data.tierInterestAmount || !Array.isArray(data.tierInterestAmount)) {
        console.warn('Invalid data structure received:', data);
        return {
          chartData: [],
          totalAmount: 0,
        };
      }

      const chartData = data.tierInterestAmount.map((item) => ({
        name: item.tierName,
        amount: parseFloat(item.interestAmount) || 0,
      }));

      return {
        chartData,
        totalAmount: parseFloat(data.totalInterestAmount) || 0,
      };
    } catch (error) {
      console.error('Error fetching flexi interest statistics:', error);
      throw error;
    }
  }
}
export const flexiInterestUsecases = new FlexiInterestUsecases();
