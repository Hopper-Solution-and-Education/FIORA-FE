import { Container } from 'inversify';
import { createMembershipAPI, IMembershipAPI } from '../data/api';
import { createMembershipRepository, IMembershipRepository } from '../data/repositories';
import {
  createGetCurrentTierUseCase,
  createGetListMembershipUseCase,
  IGetCurrentTierUseCase,
  IGetListMembershipUseCase,
} from '../domain/usecases';

const membershipDIContainer = new Container();

export const TYPES = {
  IMembershipAPI: Symbol('IMembershipAPI'),
  IMembershipRepository: Symbol('IMembershipRepository'),
  IGetListMembershipUseCase: Symbol('IGetListMembershipUseCase'),
  IGetCurrentTierUseCase: Symbol('IGetCurrentTierUseCase'),
};

// Create API instances
const membershipAPI = createMembershipAPI();

// Create repository instances
const membershipRepository = createMembershipRepository(membershipAPI);

// Create use case instances
const getListMembershipUseCase = createGetListMembershipUseCase(membershipRepository);
const getCurrentTierUseCase = createGetCurrentTierUseCase(membershipRepository);
// Bind all instances
membershipDIContainer.bind<IMembershipAPI>(TYPES.IMembershipAPI).toConstantValue(membershipAPI);
membershipDIContainer
  .bind<IMembershipRepository>(TYPES.IMembershipRepository)
  .toConstantValue(membershipRepository);
membershipDIContainer
  .bind<IGetListMembershipUseCase>(TYPES.IGetListMembershipUseCase)
  .toConstantValue(getListMembershipUseCase);
membershipDIContainer
  .bind<IGetCurrentTierUseCase>(TYPES.IGetCurrentTierUseCase)
  .toConstantValue(getCurrentTierUseCase);

export { membershipDIContainer };
