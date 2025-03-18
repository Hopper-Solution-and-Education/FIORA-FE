import { Container } from 'inversify';
import { CategoryAPI, ICategoryAPI } from '../data/api/categoryApi';
import { IProductAPI, ProductAPI } from '../data/api/productApi';
import { CategoryRepository, ICategoryRepository } from '../data/repositories/CategoryRepository';
import { IProductRepository, ProductRepository } from '../data/repositories/ProductRepository';
import {
  CreateProductUseCase,
  ICreateProductUseCase,
} from '../domain/usecases/CreateProductUsecase';
import { GetCategoryUseCase, IGetCategoryUseCase } from '../domain/usecases/GetCategoryUsecase';
import { GetProductUseCase, IGetProductUseCase } from '../domain/usecases/GetProductUsecase';
import { TYPES } from './productDIContainer.type';

const productDIContainer = new Container();

productDIContainer.bind<ICategoryAPI>(TYPES.ICategoryAPI).to(CategoryAPI);
productDIContainer.bind<ICategoryRepository>(TYPES.ICategoryRepository).to(CategoryRepository);
productDIContainer.bind<IGetCategoryUseCase>(TYPES.IGetCategoryUseCase).to(GetCategoryUseCase);
productDIContainer.bind<IProductAPI>(TYPES.IProductAPI).to(ProductAPI);
productDIContainer.bind<IProductRepository>(TYPES.IProductRepository).to(ProductRepository);
productDIContainer
  .bind<ICreateProductUseCase>(TYPES.ICreateProductUseCase)
  .to(CreateProductUseCase);
productDIContainer.bind<IGetProductUseCase>(TYPES.IGetProductUseCase).to(GetProductUseCase);

export { productDIContainer };
