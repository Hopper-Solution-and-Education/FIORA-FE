import { Container } from 'inversify';
import { createAcknowledgmentAPI } from '../data/api';
import {
  CompleteAcknowledgmentUseCase,
  ICompleteAcknowledgmentUseCase,
} from '../domain/usecases/completeAcknowledgment.usecase';
import {
  CreateAcknowledgmentFeatureUseCase,
  ICreateAcknowledgmentFeatureUseCase,
} from '../domain/usecases/createAcknowledgment.usecase';
import {
  CreateAcknowledgmentStepsUseCase,
  ICreateAcknowledgmentStepsUseCase,
} from '../domain/usecases/createAcknowledgmentSteps.usecase';
import {
  GetAcknowledgmentUseCase,
  IGetAcknowledgmentUseCase,
} from '../domain/usecases/getAcknowledgment.usecase';
import {
  GetAcknowledgmentStepsUseCase,
  IGetAcknowledgmentStepsUseCase,
} from '../domain/usecases/getAcknowledgmentSteps.usecase';
import { createAcknowledgmentRepository } from '../repositories';
import { TYPES } from './acknowledgmentDIContainer.type';

const acknowledgmentDIContainer = new Container();

// Create API instances
const acknowledgmentApi = createAcknowledgmentAPI();

// Create repository instances
const acknowledgmentRepository = createAcknowledgmentRepository(acknowledgmentApi);

// Create usecase instances
const getAcknowledgmentUseCase = new GetAcknowledgmentUseCase(acknowledgmentRepository);
const createAcknowledgmentFeatureUseCase = new CreateAcknowledgmentFeatureUseCase(
  acknowledgmentRepository,
);
const createAcknowledgmentFeatureStepsUseCase = new CreateAcknowledgmentStepsUseCase(
  acknowledgmentRepository,
);
const getAcknowledgmentStepsUseCase = new GetAcknowledgmentStepsUseCase(acknowledgmentRepository);
const completeAcknowledgmentUseCase = new CompleteAcknowledgmentUseCase(acknowledgmentRepository);

// Bind all instances to the container
acknowledgmentDIContainer
  .bind<IGetAcknowledgmentUseCase>(TYPES.IGetAcknowledgmentUseCase)
  .toConstantValue(getAcknowledgmentUseCase);

acknowledgmentDIContainer
  .bind<ICreateAcknowledgmentFeatureUseCase>(TYPES.ICreateAcknowledgmentFeatureUseCase)
  .toConstantValue(createAcknowledgmentFeatureUseCase);

acknowledgmentDIContainer
  .bind<ICreateAcknowledgmentStepsUseCase>(TYPES.ICreateAcknowledgmentFeatureStepsUseCase)
  .toConstantValue(createAcknowledgmentFeatureStepsUseCase);

acknowledgmentDIContainer
  .bind<IGetAcknowledgmentStepsUseCase>(TYPES.IGetAcknowledgmentFeatureStepsUseCase)
  .toConstantValue(getAcknowledgmentStepsUseCase);

acknowledgmentDIContainer
  .bind<ICompleteAcknowledgmentUseCase>(TYPES.ICompleteAcknowledgmentUseCase)
  .toConstantValue(completeAcknowledgmentUseCase);

export { acknowledgmentDIContainer };
