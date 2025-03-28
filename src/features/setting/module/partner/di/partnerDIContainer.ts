// src/features/setting/module/partner/di/partnerDIContainer.ts
import { Container } from 'inversify';
import { IPartnerAPI, createPartnerAPI } from '../data/api/partnerApi';
import {
  IPartnerRepository,
  createPartnerRepository,
} from '../data/repositories/PartnerRepository';
import {
  ICreatePartnerUseCase,
  createCreatePartnerUseCase,
} from '../domain/usecases/CreatePartnerUsecase';
import { IGetPartnerUseCase, createGetPartnerUseCase } from '../domain/usecases/GetPartnerUsecase';
import {
  IUpdatePartnerUseCase,
  createUpdatePartnerUseCase,
} from '../domain/usecases/UpdatePartnerUsecase';
import { TYPES } from './partnerDIContainer.type';

const partnerDIContainer = new Container();

// Create API instances
const partnerAPI = createPartnerAPI();

// Create repository instances
const partnerRepository = createPartnerRepository(partnerAPI);

// Create use case instances
const createPartnerUseCase = createCreatePartnerUseCase(partnerRepository);
const getPartnerUseCase = createGetPartnerUseCase(partnerRepository);
const updatePartnerUseCase = createUpdatePartnerUseCase(partnerRepository);

// Bind all instances
partnerDIContainer.bind<IPartnerAPI>(TYPES.IPartnerAPI).toConstantValue(partnerAPI);
partnerDIContainer
  .bind<IPartnerRepository>(TYPES.IPartnerRepository)
  .toConstantValue(partnerRepository);
partnerDIContainer
  .bind<ICreatePartnerUseCase>(TYPES.ICreatePartnerUseCase)
  .toConstantValue(createPartnerUseCase);
partnerDIContainer
  .bind<IGetPartnerUseCase>(TYPES.IGetPartnerUseCase)
  .toConstantValue(getPartnerUseCase);
partnerDIContainer
  .bind<IUpdatePartnerUseCase>(TYPES.IUpdatePartnerUseCase)
  .toConstantValue(updatePartnerUseCase);

export { partnerDIContainer };
