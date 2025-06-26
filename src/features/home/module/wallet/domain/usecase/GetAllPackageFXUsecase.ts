import { inject, injectable } from 'inversify';
import { WALLET_TYPES } from '../../di/walletDIContainer.type';
import type { IWalletRepository } from '../../data/repository/IWalletRepository';
import { PackageFX } from '../entity/PackageFX';

export interface IGetAllPackageFXUsecase {
  execute(): Promise<PackageFX[]>;
}

@injectable()
export class GetAllPackageFXUsecase implements IGetAllPackageFXUsecase {
  constructor(
    @inject(WALLET_TYPES.IWalletRepository)
    private readonly walletRepository: IWalletRepository,
  ) {}

  execute(): Promise<PackageFX[]> {
    return this.walletRepository.getAllPackageFX();
  }
}
