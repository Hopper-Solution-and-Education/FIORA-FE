import { httpClient, IHttpClient } from '@/config/HttpClient';
import { Container } from 'inversify';
import { CategoryAPI, ICategoryAPI } from '../data/api/categoryApi';
import { CategoryRepository, ICategoryRepository } from '../data/repositories/CategoryRepository';
import { GetCategoryUseCase, IGetCategoryUseCase } from '../domain/usecases/GetCategoryUsecase';
import { TYPES } from './productDIContainer.type';

const productDIContainer = new Container();

productDIContainer.bind<IHttpClient>(TYPES.IHttpClient).toConstantValue(httpClient);
productDIContainer.bind<ICategoryAPI>(TYPES.ICategoryAPI).to(CategoryAPI);
productDIContainer.bind<ICategoryRepository>(TYPES.ICategoryRepository).to(CategoryRepository);
productDIContainer.bind<IGetCategoryUseCase>(TYPES.IGetCategoryUseCase).to(GetCategoryUseCase);

console.log(productDIContainer.get<IGetCategoryUseCase>(TYPES.IGetCategoryUseCase));

export { productDIContainer };
