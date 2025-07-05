export const WALLET_SETTING_TYPES = {
  IHttpClient: Symbol.for('HttpClient'),

  // Datasources
  IWalletSettingApi: Symbol.for('WalletSettingApi'),

  // Repositories
  IWalletSettingRepository: Symbol.for('WalletSettingRepository'),

  // UseCases
  IGetDepositRequestsPaginatedUseCase: Symbol.for('GetDepositRequestsPaginatedUseCase'),
  IUpdateDepositRequestStatusUseCase: Symbol.for('UpdateDepositRequestStatusUseCase'),
};
