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
  ICreateCategoryProductUseCase,
  createCreateCategoryProductUseCase,
} from '../domain/usecases/CreateCategoryProductUseCase';
import {
  ICreateProductUseCase,
  createCreateProductUseCase,
} from '../domain/usecases/CreateProductUsecase';
import {
  IDeleteCategoryProductUseCase,
  createDeleteCategoryProductUseCase,
} from '../domain/usecases/DeleteCategoryProductUseCase';
import {
  IDeleteProductTransferUseCase,
  createDeleteProductTransferUseCase,
} from '../domain/usecases/DeleteProductTransferUseCase';
import {
  IDeleteProductUseCase,
  createDeleteProductUseCase,
} from '../domain/usecases/DeleteProductUsecase';
import {
  IGetCategoryProductUseCase,
  createGetCategoryProductUseCase,
} from '../domain/usecases/GetCategoryProductUseCase';
import {
  IGetProductTransactionUseCase,
  createGetProductTransactionUseCase,
} from '../domain/usecases/GetProductTransactionUseCase';
import { IGetProductUseCase, createGetProductUseCase } from '../domain/usecases/GetProductUsecase';
import {
  IGetSingleProductUseCase,
  createGetSingleProductUseCase,
} from '../domain/usecases/GetSingleProductUsecase';
import {
  IUpdateCategoryProductUseCase,
  createUpdateCategoryProductUseCase,
} from '../domain/usecases/UpdateCategoryProductUseCase';
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
const getCategoryProductUseCase = createGetCategoryProductUseCase(categoryRepository);
const createProductUseCase = createCreateProductUseCase(productRepository);
const getProductUseCase = createGetProductUseCase(productRepository);
const updateProductUseCase = createUpdateProductUseCase(productRepository);
const deleteProductUseCase = createDeleteProductUseCase(productRepository);
const deleteProductTransferUseCase = createDeleteProductTransferUseCase(productRepository);
const getProductTransactionUseCase = createGetProductTransactionUseCase(productRepository);
const getSingleProductUseCase = createGetSingleProductUseCase(productRepository);
const createCategoryProductUseCase = createCreateCategoryProductUseCase(categoryRepository);
const updateCategoryProductUseCase = createUpdateCategoryProductUseCase(categoryRepository);
const deleteCategoryProductUseCase = createDeleteCategoryProductUseCase(categoryRepository);

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
  .bind<IGetCategoryProductUseCase>(TYPES.IGetCategoryProductUseCase)
  .toConstantValue(getCategoryProductUseCase);
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
productDIContainer
  .bind<ICreateCategoryProductUseCase>(TYPES.ICreateCategoryProductUseCase)
  .toConstantValue(createCategoryProductUseCase);
productDIContainer
  .bind<IUpdateCategoryProductUseCase>(TYPES.IUpdateCategoryProductUseCase)
  .toConstantValue(updateCategoryProductUseCase);
productDIContainer
  .bind<IDeleteCategoryProductUseCase>(TYPES.IDeleteCategoryProductUseCase)
  .toConstantValue(deleteCategoryProductUseCase);
productDIContainer
  .bind<IDeleteProductTransferUseCase>(TYPES.IDeleteProductTransferUseCase)
  .toConstantValue(deleteProductTransferUseCase);

export { productDIContainer };
