import { Container } from 'inversify';
import { WALLET_TYPES } from './walletDIContainer.type';

// DataSource
import { WalletApi } from '../data/api';
// Repository
import { WalletRepository } from '../data/repository';
// UseCase
import { GetWalletUsecase } from '../domain/usecase';
import { httpClient } from '@/config';

const walletContainer = new Container();

walletContainer.bind(WALLET_TYPES.IHttpClient).toConstantValue(httpClient);

walletContainer.bind(WALLET_TYPES.IWalletApi).to(WalletApi).inSingletonScope();
// Bind Repository
walletContainer.bind(WALLET_TYPES.IWalletRepository).to(WalletRepository).inSingletonScope();
// Bind UseCase
walletContainer.bind(WALLET_TYPES.IGetWalletsUseCase).to(GetWalletUsecase).inSingletonScope();

export { walletContainer };
