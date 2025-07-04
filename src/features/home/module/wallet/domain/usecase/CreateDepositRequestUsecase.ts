import { inject, injectable } from 'inversify';
import { WALLET_TYPES } from '../../di/walletDIContainer.type';
import type { IWalletRepository } from '../../data/repository/IWalletRepository';
import type { DepositRequest } from '../entity/DepositRequest';
import type { CreateDepositRequestDto } from '../../data/dto/request/CreateDepositRequestDto';

@injectable()
export class CreateDepositRequestUsecase {
  constructor(
    @inject(WALLET_TYPES.IWalletRepository)
    private readonly walletRepository: IWalletRepository,
  ) {}

  execute(data: CreateDepositRequestDto): Promise<DepositRequest> {
    return this.walletRepository.createDepositRequest(data);
  }
}
