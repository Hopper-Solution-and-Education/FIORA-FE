export const WALLET_TYPES = {
  IHttpClient: Symbol.for('HttpClient'),

  // Datasources
  IWalletApi: Symbol.for('WalletApi'),

  // Repositories
  IWalletRepository: Symbol.for('WalletRepository'),

  // UseCases
  IGetWalletByTypeUseCase: Symbol.for('GetWalletByTypeUseCase'),
  IGetWalletsUseCase: Symbol.for('GetWalletsUseCase'),
  IGetAllPackageFXUseCase: Symbol.for('GetAllPackageFXUseCase'),
  ICreateDepositRequestUseCase: Symbol.for('CreateDepositRequestUseCase'),
  IGetFrozenAmountUseCase: Symbol.for('GetFrozenAmountUseCase'),
};
