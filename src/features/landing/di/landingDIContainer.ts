import { Container } from 'inversify';
import { ILandingAPI, LandingAPI } from '../data/api/api';
import { IMediaRepository, MediaRepository } from '../data/repositories/mediaRepository';
import { httpClient, IHttpClient } from './../../../config/HttpClient';
import { GetMediaUseCase } from './../domain/use-cases/GetMediaUseCase';
import { TYPES } from './landingDIContainer.type';

const landingDIContainer = new Container();

landingDIContainer.bind<IHttpClient>(TYPES.IHttpClient).toConstantValue(httpClient);

landingDIContainer.bind<ILandingAPI>(TYPES.ILandingAPI).to(LandingAPI).inSingletonScope();

landingDIContainer
  .bind<IMediaRepository>(TYPES.IMediaRepository)
  .to(MediaRepository)
  .inSingletonScope();

landingDIContainer.bind<GetMediaUseCase>(TYPES.GetMediaUseCase).to(GetMediaUseCase);

landingDIContainer.bind(GetMediaUseCase).toSelf();

export { landingDIContainer };
