import { Container } from 'inversify';
import { httpClient, IHttpClient } from '../../../config/HttpClient';
import { ILandingAPI, LandingAPI } from '../data/api/api';
import { IMediaRepository, MediaRepository } from '../data/repositories/mediaRepository';
import { ISectionRepository, SectionRepository } from '../data/repositories/sectionRepository';
import { GetMediaUseCase } from '../domain/use-cases/GetMediaUseCase';
import { GetSectionUseCase } from '../domain/use-cases/GetSectionUseCase';
import { TYPES } from './landingDIContainer.type';

const landingDIContainer = new Container();

landingDIContainer.bind<IHttpClient>(TYPES.IHttpClient).toConstantValue(httpClient);
landingDIContainer.bind<ILandingAPI>(TYPES.ILandingAPI).to(LandingAPI);
landingDIContainer.bind<IMediaRepository>(TYPES.IMediaRepository).to(MediaRepository);
landingDIContainer.bind<ISectionRepository>(TYPES.ISectionRepository).to(SectionRepository);
landingDIContainer.bind<GetMediaUseCase>(TYPES.GetMediaUseCase).to(GetMediaUseCase);
landingDIContainer.bind<GetSectionUseCase>(TYPES.GetSectionUseCase).to(GetSectionUseCase);

export { landingDIContainer };
