// src/features/admin/di/index.ts
import apiClient from '@/config/http-client';
import { Container } from 'inversify';
import { IAnnouncementAPI, createAnnouncementAPI } from '../data/api/announcementApi';
import { ISectionAPI, createSectionAPI } from '../data/api/sectionApi';
import {
  IAnnouncementRepository,
  createAnnouncementRepository,
} from '../data/repositories/annoucementRepository';
import {
  ISectionRepository,
  createSectionRepository,
} from '../data/repositories/sectionRepository';

import {
  GetAnnouncementUseCase,
  createGetAnnouncementUseCase,
} from '../domain/usecases/GetAnnoucementUseCase';
import { GetSectionUseCase, createGetSectionUseCase } from '../domain/usecases/GetSectionUseCase';
import {
  UpdateAnnouncementUseCase,
  createUpdateAnnouncementUseCase,
} from '../domain/usecases/UpdateAnnoucementUseCase';
import {
  UpdateSectionUseCase,
  createUpdateSectionUseCase,
} from '../domain/usecases/UpdateSectionUseCase';
import { TYPES } from './adminDIContainer.type';

// Create the admin container
const adminContainer = new Container();

// Create instances using factory functions
const sectionAPI = createSectionAPI(apiClient);
const announcementAPI = createAnnouncementAPI(apiClient);
const sectionRepository = createSectionRepository(sectionAPI);
const announcementRepository = createAnnouncementRepository(announcementAPI);
const getSectionUseCase = createGetSectionUseCase(sectionRepository);
const updateSectionUseCase = createUpdateSectionUseCase(sectionRepository);
const getAnnouncementUseCase = createGetAnnouncementUseCase(announcementRepository);
const updateAnnouncementUseCase = createUpdateAnnouncementUseCase(announcementRepository);

// Bind all dependencies
adminContainer.bind<ISectionAPI>(TYPES.ISectionAPI).toConstantValue(sectionAPI);
adminContainer
  .bind<ISectionRepository>(TYPES.ISectionRepository)
  .toConstantValue(sectionRepository);
adminContainer.bind(GetSectionUseCase).toConstantValue(getSectionUseCase);
adminContainer.bind(UpdateSectionUseCase).toConstantValue(updateSectionUseCase);
adminContainer.bind<IAnnouncementAPI>(TYPES.IAnnouncementAPI).toConstantValue(announcementAPI);
adminContainer
  .bind<IAnnouncementRepository>(TYPES.IAnnouncementRepository)
  .toConstantValue(announcementRepository);
adminContainer.bind(GetAnnouncementUseCase).toConstantValue(getAnnouncementUseCase);
adminContainer.bind(UpdateAnnouncementUseCase).toConstantValue(updateAnnouncementUseCase);

export { adminContainer };
