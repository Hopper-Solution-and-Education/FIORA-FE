import { Currency } from '@/shared/types';
import { inject, injectable } from 'inversify';
import type { CreateDepositRequestDto } from '../../data/dto/request/CreateDepositRequestDto';
import type { IWalletRepository } from '../../data/repository/IWalletRepository';
import { WALLET_TYPES } from '../../di/walletDIContainer.type';
import type { DepositRequest } from '../entity/DepositRequest';

@injectable()
export class CreateDepositRequestUsecase {
  constructor(
    @inject(WALLET_TYPES.IWalletRepository)
    private readonly walletRepository: IWalletRepository,
  ) {}

  execute(data: CreateDepositRequestDto, currency: Currency): Promise<DepositRequest> {
    return this.walletRepository.createDepositRequest(data, currency);
  }
}
