// src/features/admin/di/types.ts
export const TYPES = {
  IHttpClient: Symbol.for('IHttpClient'),
  ILandingAPI: Symbol.for('ILandingAPI'),
  IMediaRepository: Symbol.for('IMediaRepository'),
  ISectionRepository: Symbol.for('ISectionRepository'),
  GetMediaUseCase: Symbol.for('GetMediaUseCase'),
  GetSectionUseCase: Symbol.for('GetSectionUseCase'),
};
