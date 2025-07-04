import { Container } from 'inversify';
import { WALLET_TYPES } from './walletDIContainer.type';

// DataSource
import { WalletApi } from '../data/api';
// Repository
import { WalletRepository } from '../data/repository';
// UseCase
import { GetWalletByTypeUsecase } from '../domain/usecase/GetWalletByTypeUsecase';
import { GetWalletsUsecase } from '../domain/usecase/GetWalletsUsecase';
import { GetAllPackageFXUsecase } from '../domain/usecase/GetAllPackageFXUsecase';
import { CreateDepositRequestUsecase } from '../domain/usecase/CreateDepositRequestUsecase';
import { GetFrozenAmountUsecase } from '../domain/usecase/GetFrozenAmountUsecase';
import { httpClient } from '@/config';

const walletContainer = new Container();

walletContainer.bind(WALLET_TYPES.IHttpClient).toConstantValue(httpClient);

walletContainer.bind(WALLET_TYPES.IWalletApi).to(WalletApi).inSingletonScope();
// Bind Repository
walletContainer.bind(WALLET_TYPES.IWalletRepository).to(WalletRepository).inSingletonScope();

// Bind UseCases
walletContainer
  .bind(WALLET_TYPES.IGetWalletByTypeUseCase)
  .to(GetWalletByTypeUsecase)
  .inSingletonScope();

walletContainer.bind(WALLET_TYPES.IGetWalletsUseCase).to(GetWalletsUsecase).inSingletonScope();

walletContainer
  .bind(WALLET_TYPES.IGetAllPackageFXUseCase)
  .to(GetAllPackageFXUsecase)
  .inSingletonScope();

walletContainer
  .bind(WALLET_TYPES.ICreateDepositRequestUseCase)
  .to(CreateDepositRequestUsecase)
  .inSingletonScope();

walletContainer
  .bind(WALLET_TYPES.IGetFrozenAmountUseCase)
  .to(GetFrozenAmountUsecase)
  .inSingletonScope();

export { walletContainer };
