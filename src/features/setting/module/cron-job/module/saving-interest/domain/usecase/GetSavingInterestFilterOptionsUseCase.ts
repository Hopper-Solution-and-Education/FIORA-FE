import { decorate, inject, injectable } from 'inversify';
import { FilterOptions } from '../../data/api/ISavingInterestDashboardApi';
import { ISavingInterestRepository } from '../../data/repository/SavingInterestRepository';
import { SAVING_INTEREST_TYPES } from '../../di/savingInterestDashboardDI.type';

export interface IGetSavingInterestFilterOptionsUseCase {
  execute(): Promise<FilterOptions>;
}

export class GetSavingInterestFilterOptionsUseCase
  implements IGetSavingInterestFilterOptionsUseCase
{
  constructor(private repository: ISavingInterestRepository) {}

  async execute(): Promise<FilterOptions> {
    return await this.repository.getFilterOptions();
  }
}

decorate(injectable(), GetSavingInterestFilterOptionsUseCase);
decorate(
  inject(SAVING_INTEREST_TYPES.ISavingInterestRepository),
  GetSavingInterestFilterOptionsUseCase,
  0,
);
