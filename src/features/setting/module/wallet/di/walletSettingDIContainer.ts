import { Container } from 'inversify';
import { WALLET_SETTING_TYPES } from './walletSettingDIContainer.type';
import { httpClient } from '@/config';
import { IWalletSettingApi, WalletSettingApi } from '../data/api';
import { IWalletSettingRepository, WalletSettingRepository } from '../data/repository';
import {
  IGetDepositRequestsPaginatedUseCase,
  GetDepositRequestsPaginatedUseCase,
  IUpdateDepositRequestStatusUseCase,
  UpdateDepositRequestStatusUseCase,
} from '../domain';

const walletSettingContainer = new Container();

// Bind HttpClient
walletSettingContainer.bind(WALLET_SETTING_TYPES.IHttpClient).toConstantValue(httpClient);

// Bind APIs
walletSettingContainer
  .bind<IWalletSettingApi>(WALLET_SETTING_TYPES.IWalletSettingApi)
  .to(WalletSettingApi)
  .inSingletonScope();

// Bind Repositories
walletSettingContainer
  .bind<IWalletSettingRepository>(WALLET_SETTING_TYPES.IWalletSettingRepository)
  .to(WalletSettingRepository)
  .inSingletonScope();

// Bind UseCases
walletSettingContainer
  .bind<IGetDepositRequestsPaginatedUseCase>(
    WALLET_SETTING_TYPES.IGetDepositRequestsPaginatedUseCase,
  )
  .to(GetDepositRequestsPaginatedUseCase)
  .inSingletonScope();

walletSettingContainer
  .bind<IUpdateDepositRequestStatusUseCase>(WALLET_SETTING_TYPES.IUpdateDepositRequestStatusUseCase)
  .to(UpdateDepositRequestStatusUseCase)
  .inSingletonScope();

export { walletSettingContainer };
