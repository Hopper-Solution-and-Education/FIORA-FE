import { Container } from 'inversify';
import { ICategoryAPI, createCategoryAPI } from '../data/api/categoryApi';
import { IProductAPI, createProductAPI } from '../data/api/productApi';
import {
  ICategoryRepository,
  createCategoryRepository,
} from '../data/repositories/CategoryRepository';
import {
  IProductRepository,
  createProductRepository,
} from '../data/repositories/ProductRepository';
import {
  ICreateProductUseCase,
  createCreateProductUseCase,
} from '../domain/usecases/CreateProductUsecase';
import {
  IDeleteProductUseCase,
  createDeleteProductUseCase,
} from '../domain/usecases/DeleteProductUsecase';
import {
  IGetCategoryUseCase,
  createGetCategoryUseCase,
} from '../domain/usecases/GetCategoryUsecase';
import {
  IGetProductTransactionUseCase,
  createGetProductTransactionUseCase,
} from '../domain/usecases/GetProductTransactionUseCase';
import { IGetProductUseCase, createGetProductUseCase } from '../domain/usecases/GetProductUsecase';
import {
  createGetSingleProductUseCase,
  IGetSingleProductUseCase,
} from '../domain/usecases/GetSingleProductUsecase';
import {
  IUpdateProductUseCase,
  createUpdateProductUseCase,
} from '../domain/usecases/UpdateProductUsecase';
import { TYPES } from './productDIContainer.type';

const productDIContainer = new Container();

// Create API instances
const categoryAPI = createCategoryAPI();
const productAPI = createProductAPI();

// Create repository instances
const categoryRepository = createCategoryRepository(categoryAPI);
const productRepository = createProductRepository(productAPI);

// Create use case instances
const getCategoryUseCase = createGetCategoryUseCase(categoryRepository);
const createProductUseCase = createCreateProductUseCase(productRepository);
const getProductUseCase = createGetProductUseCase(productRepository);
const updateProductUseCase = createUpdateProductUseCase(productRepository);
const deleteProductUseCase = createDeleteProductUseCase(productRepository);
const getProductTransactionUseCase = createGetProductTransactionUseCase(productRepository);
const getSingleProductUseCase = createGetSingleProductUseCase(productRepository);

// Bind all instances
productDIContainer.bind<ICategoryAPI>(TYPES.ICategoryAPI).toConstantValue(categoryAPI);
productDIContainer
  .bind<ICategoryRepository>(TYPES.ICategoryRepository)
  .toConstantValue(categoryRepository);
productDIContainer.bind<IProductAPI>(TYPES.IProductAPI).toConstantValue(productAPI);
productDIContainer
  .bind<IProductRepository>(TYPES.IProductRepository)
  .toConstantValue(productRepository);

productDIContainer
  .bind<IGetCategoryUseCase>(TYPES.IGetCategoryUseCase)
  .toConstantValue(getCategoryUseCase);
productDIContainer
  .bind<ICreateProductUseCase>(TYPES.ICreateProductUseCase)
  .toConstantValue(createProductUseCase);
productDIContainer
  .bind<IGetProductUseCase>(TYPES.IGetProductUseCase)
  .toConstantValue(getProductUseCase);
productDIContainer
  .bind<IUpdateProductUseCase>(TYPES.IUpdateProductUseCase)
  .toConstantValue(updateProductUseCase);
productDIContainer
  .bind<IDeleteProductUseCase>(TYPES.IDeleteProductUseCase)
  .toConstantValue(deleteProductUseCase);
productDIContainer
  .bind<IGetProductTransactionUseCase>(TYPES.IGetProductTransactionUseCase)
  .toConstantValue(getProductTransactionUseCase);
productDIContainer
  .bind<IGetSingleProductUseCase>(TYPES.IGetSingleProductUseCase)
  .toConstantValue(getSingleProductUseCase);

export { productDIContainer };
