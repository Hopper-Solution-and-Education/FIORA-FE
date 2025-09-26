import { decorate, inject, injectable } from 'inversify';
import { SavingInterestFilters } from '../../data/api/ISavingInterestDashboardApi';
import { SavingInterestChartResponse } from '../../data/dto/response/SavingInterestResponse';
import { ISavingInterestRepository } from '../../data/repository/SavingInterestRepository';
import { SAVING_INTEREST_TYPES } from '../../di/savingInterestDashboardDI.type';

export interface IGetSavingInterestChartDataUseCase {
  execute(filters: Partial<SavingInterestFilters>): Promise<SavingInterestChartResponse>;
}

export class GetSavingInterestChartDataUseCase implements IGetSavingInterestChartDataUseCase {
  private repo: ISavingInterestRepository;

  constructor(repo: ISavingInterestRepository) {
    this.repo = repo;
  }

  async execute(filters: Partial<SavingInterestFilters>): Promise<SavingInterestChartResponse> {
    return this.repo.getSavingInterestChartData(filters);
  }
}

decorate(injectable(), GetSavingInterestChartDataUseCase);
decorate(
  inject(SAVING_INTEREST_TYPES.ISavingInterestRepository),
  GetSavingInterestChartDataUseCase,
  0,
);
