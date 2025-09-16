export const MEMBERSHIP_CRONJOB_TYPES = {
  IHttpClient: Symbol.for('HttpClient'),

  // Datasources
  IMembershipCronjobDashboardApi: Symbol.for('MembershipCronjobDashboardApi'),

  // Repositories
  IMembershipCronjobRepository: Symbol.for('MembershipCronjobRepository'),
  // Usecases
  IGetMembershipCronjobsPaginatedUseCase: Symbol.for('GetMembershipCronjobsPaginatedUseCase'),
  IGetMembershipDynamicFieldsUseCase: Symbol.for('GetMembershipDynamicFieldsUseCase'),
  IGetMembershipChartDataUseCase: Symbol.for('GetMembershipChartDataUseCase'),
  IGetMembershipTiersUseCase: Symbol.for('GetMembershipTiersUseCase'),
  IGetMembershipUsersUseCase: Symbol.for('GetMembershipUsersUseCase'),
  IResendMembershipUseCase: Symbol.for('ResendMembershipUseCase'),
};
