import { decorate, inject, injectable } from 'inversify';
import { SavingInterestFilters } from '../../data/api/ISavingInterestDashboardApi';
import { SavingInterestResponse } from '../../data/dto/response/SavingInterestResponse';
import { ISavingInterestRepository } from '../../data/repository/SavingInterestRepository';
import { SAVING_INTEREST_TYPES } from '../../di/savingInterestDashboardDI.type';

export interface IGetSavingInterestPaginatedUseCase {
  execute(
    page: number,
    pageSize: number,
    filters: SavingInterestFilters,
  ): Promise<SavingInterestResponse>;
}

export class GetSavingInterestPaginatedUseCase implements IGetSavingInterestPaginatedUseCase {
  private repo: ISavingInterestRepository;

  constructor(repo: ISavingInterestRepository) {
    this.repo = repo;
  }

  async execute(
    page: number,
    pageSize: number,
    filters: SavingInterestFilters,
  ): Promise<SavingInterestResponse> {
    return this.repo.getSavingInterestData(page, pageSize, filters);
  }
}

decorate(injectable(), GetSavingInterestPaginatedUseCase);
decorate(
  inject(SAVING_INTEREST_TYPES.ISavingInterestRepository),
  GetSavingInterestPaginatedUseCase,
  0,
);
