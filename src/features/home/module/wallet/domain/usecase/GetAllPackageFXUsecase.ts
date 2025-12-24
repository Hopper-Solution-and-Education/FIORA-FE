import { inject, injectable } from 'inversify';
import type { GetPackageFXPaginatedRequest } from '../../data/dto/request/GetPackageFXPaginatedRequest';
import type { PackageFXMappedResult } from '../../data/mapper/PackageFXMapper';
import type { IWalletRepository } from '../../data/repository/IWalletRepository';
import { WALLET_TYPES } from '../../di/walletDIContainer.type';
import { PackageFX } from '../entity/PackageFX';

export interface IGetAllPackageFXUsecase {
  execute(request?: GetPackageFXPaginatedRequest): Promise<PackageFX[] | PackageFXMappedResult>;
}

@injectable()
export class GetAllPackageFXUsecase implements IGetAllPackageFXUsecase {
  constructor(
    @inject(WALLET_TYPES.IWalletRepository)
    private readonly walletRepository: IWalletRepository,
  ) {}

  async execute(
    request?: GetPackageFXPaginatedRequest,
  ): Promise<PackageFX[] | PackageFXMappedResult> {
    if (request && (request.sortBy || request.page || request.limit || request.search)) {
      return this.walletRepository.getPackageFXPaginated(request);
    }
    return this.walletRepository.getAllPackageFX();
  }
}
