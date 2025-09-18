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
}
export const flexiInterestUsecases = new FlexiInterestUsecases();
