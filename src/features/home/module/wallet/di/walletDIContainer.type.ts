export const WALLET_TYPES = {
  IHttpClient: Symbol.for('HttpClient'),

  // Datasources
  IWalletApi: Symbol.for('WalletApi'),

  // Repositories
  IWalletRepository: Symbol.for('WalletRepository'),

  // UseCases
  IGetWalletsUseCase: Symbol.for('GetWalletsUseCase'),
};
