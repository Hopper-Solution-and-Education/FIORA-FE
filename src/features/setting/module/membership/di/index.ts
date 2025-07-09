import { Container } from 'inversify';
import { createMembershipAPI, IMembershipAPI } from '../data/api';
import { createMembershipRepository, IMembershipRepository } from '../data/repositories';
import {
  createAddNewBenefitUseCase,
  createGetListMembershipUseCase,
  createUpsertMembershipUseCase,
  IAddNewBenefitUseCase,
  IGetListMembershipUseCase,
  IUpsertMembershipUseCase,
} from '../domain/usecases';

const membershipDIContainer = new Container();

export const TYPES = {
  IMembershipAPI: Symbol('IMembershipAPI'),
  IMembershipRepository: Symbol('IMembershipRepository'),
  IGetListMembershipUseCase: Symbol('IGetListMembershipUseCase'),
  IUpsertMembershipUseCase: Symbol('IUpsertMembershipUseCase'),
  IAddNewBenefitUseCase: Symbol('IAddNewBenefitUseCase'),
};

// Create API instances
const membershipAPI = createMembershipAPI();

// Create repository instances
const membershipRepository = createMembershipRepository(membershipAPI);

// Create use case instances
const getListMembershipUseCase = createGetListMembershipUseCase(membershipRepository);
const upsertMembershipUseCase = createUpsertMembershipUseCase(membershipRepository);
const addNewBenefitUseCase = createAddNewBenefitUseCase(membershipRepository);

// Bind all instances
membershipDIContainer.bind<IMembershipAPI>(TYPES.IMembershipAPI).toConstantValue(membershipAPI);
membershipDIContainer
  .bind<IMembershipRepository>(TYPES.IMembershipRepository)
  .toConstantValue(membershipRepository);
membershipDIContainer
  .bind<IGetListMembershipUseCase>(TYPES.IGetListMembershipUseCase)
  .toConstantValue(getListMembershipUseCase);
membershipDIContainer
  .bind<IUpsertMembershipUseCase>(TYPES.IUpsertMembershipUseCase)
  .toConstantValue(upsertMembershipUseCase);
membershipDIContainer
  .bind<IAddNewBenefitUseCase>(TYPES.IAddNewBenefitUseCase)
  .toConstantValue(addNewBenefitUseCase);

export { membershipDIContainer };
