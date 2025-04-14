// src/features/admin/di/index.ts
import { httpClient, IHttpClient } from '@/config/http-client/HttpClient';
import { Container } from 'inversify';
import { ISectionAPI, createSectionAPI } from '../landing/data/api/sectionApi';
import {
  ISectionRepository,
  createSectionRepository,
} from '../landing/data/repositories/sectionRepository';
import {
  GetSectionUseCase,
  createGetSectionUseCase,
} from '../landing/domain/usecases/GetSectionUseCase';
import {
  UpdateSectionUseCase,
  createUpdateSectionUseCase,
} from '../landing/domain/usecases/UpdateSectionUseCase';
import { TYPES } from './adminDIContainer.type';

// Create the admin container
const adminContainer = new Container();

// Create instances using factory functions
const sectionAPI = createSectionAPI(httpClient);
const sectionRepository = createSectionRepository(sectionAPI);
const getSectionUseCase = createGetSectionUseCase(sectionRepository);
const updateSectionUseCase = createUpdateSectionUseCase(sectionRepository);

// Bind all dependencies
adminContainer.bind<IHttpClient>(TYPES.IHttpClient).toConstantValue(httpClient);
adminContainer.bind<ISectionAPI>(TYPES.ISectionAPI).toConstantValue(sectionAPI);
adminContainer
  .bind<ISectionRepository>(TYPES.ISectionRepository)
  .toConstantValue(sectionRepository);
adminContainer.bind(GetSectionUseCase).toConstantValue(getSectionUseCase);
adminContainer.bind(UpdateSectionUseCase).toConstantValue(updateSectionUseCase);

export { adminContainer };
