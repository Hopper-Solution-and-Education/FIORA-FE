import { IFlexiInterestRepository } from '../domain/repositories/flexiInterestRepositories.Interface';
import { FlexiInterestRepositories } from '../infrastructure/repositories/flexiInterestRepositories';

class FlexiInterestUsecases {
  constructor(private _flexiInterestRepo: IFlexiInterestRepository = FlexiInterestRepositories) {}
  async getFlexiInterestPaginated({
    page,
    pageSize,
    search,
    status,
    fromDate,
    toDate,
    emailUpdateBy,
    email,
    tierName,
  }: {
    page: number;
    pageSize: number;
    search?: string;
    status?: string | string[];
    emailUpdateBy?: string | string[];
    email?: string | string[];
    tierName?: string | string[];
    fromDate?: string;
    toDate?: string;
  }) {
    const filter = {
      status,
      fromDate,
      toDate,
      emailUpdateBy,
      email,
      tierName,
    };
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
  async getFlexiInterestFilerOptions() {
    return await this._flexiInterestRepo.getFlexiInterestFilerOptions();
  }
}
export const flexiInterestUsecases = new FlexiInterestUsecases();
