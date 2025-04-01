// src/features/setting/module/partner/di/partnerDIContainer.type.ts
export const TYPES = {
  IPartnerAPI: Symbol.for('IPartnerAPI'),
  IPartnerRepository: Symbol.for('IPartnerRepository'),
  ICreatePartnerUseCase: Symbol.for('ICreatePartnerUseCase'),
  IGetPartnerUseCase: Symbol.for('IGetPartnerUseCase'),
  IUpdatePartnerUseCase: Symbol.for('IUpdatePartnerUseCase'),
  IGetPartnerByIdUseCase: Symbol.for('IGetPartnerByIdUseCase'),
};
