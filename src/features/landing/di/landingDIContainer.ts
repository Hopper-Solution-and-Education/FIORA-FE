import { Container } from 'inversify';
import apiClient from '../../../config/http-client';
import { ILandingAPI, createLandingAPI } from '../data/api/api';
import { IMediaRepository, createMediaRepository } from '../data/repositories/mediaRepository';
import {
  ISectionRepository,
  createSectionRepository,
} from '../data/repositories/sectionRepository';
import { GetMediaUseCase, createGetMediaUseCase } from '../domain/use-cases/GetMediaUseCase';
import { GetSectionUseCase, createGetSectionUseCase } from '../domain/use-cases/GetSectionUseCase';
import { TYPES } from './landingDIContainer.type';

const landingDIContainer = new Container();

// Create instances using factory functions
const landingAPI = createLandingAPI(apiClient);
const mediaRepository = createMediaRepository(landingAPI);
const sectionRepository = createSectionRepository(landingAPI);
const getMediaUseCase = createGetMediaUseCase(mediaRepository);
const getSectionUseCase = createGetSectionUseCase(sectionRepository);

// Bind all dependencies
landingDIContainer.bind<ILandingAPI>(TYPES.ILandingAPI).toConstantValue(landingAPI);
landingDIContainer.bind<IMediaRepository>(TYPES.IMediaRepository).toConstantValue(mediaRepository);
landingDIContainer
  .bind<ISectionRepository>(TYPES.ISectionRepository)
  .toConstantValue(sectionRepository);
landingDIContainer.bind<GetMediaUseCase>(TYPES.GetMediaUseCase).toConstantValue(getMediaUseCase);
landingDIContainer
  .bind<GetSectionUseCase>(TYPES.GetSectionUseCase)
  .toConstantValue(getSectionUseCase);

export { landingDIContainer };
