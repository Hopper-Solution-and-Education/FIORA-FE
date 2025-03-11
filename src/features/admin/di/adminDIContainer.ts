// src/features/admin/di/index.ts
import { httpClient, IHttpClient } from '@/lib/HttpClient';
import { Container } from 'inversify';
import { ISectionAPI, SectionAPI } from '../banner/data/api/sectionApi';
import {
  ISectionRepository,
  SectionRepository,
} from '../banner/data/repositories/sectionRepository';
import { GetSectionUseCase } from '../banner/domain/usecases/GetSectionUseCase';
import { TYPES } from './adminDIContainer.type';

// Create the admin container
const adminContainer = new Container();

adminContainer.bind<IHttpClient>(TYPES.IHttpClient).toConstantValue(httpClient);
adminContainer.bind<ISectionAPI>(TYPES.ISectionAPI).to(SectionAPI).inSingletonScope();
adminContainer
  .bind<ISectionRepository>(TYPES.ISectionRepository)
  .to(SectionRepository)
  .inSingletonScope();
adminContainer.bind(GetSectionUseCase).toSelf();

export { adminContainer };
