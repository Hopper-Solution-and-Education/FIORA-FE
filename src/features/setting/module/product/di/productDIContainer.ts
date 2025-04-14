import { Container } from 'inversify';
import { createCategoryAPI, createProductAPI, ICategoryAPI, IProductAPI } from '../data/api';

import {
  createCategoryRepository,
  createProductRepository,
  ICategoryRepository,
  IProductRepository,
} from '../data/repositories';
import {
  createCreateCategoryProductUseCase,
  createCreateProductUseCase,
  createDeleteCategoryProductUseCase,
  createDeleteProductTransferUseCase,
  createDeleteProductUseCase,
  createGetCategoryProductUseCase,
  createGetProductTransactionUseCase,
  createGetProductUseCase,
  createGetSingleProductUseCase,
  createUpdateCategoryProductUseCase,
  createUpdateProductUseCase,
  ICreateCategoryProductUseCase,
  ICreateProductUseCase,
  IDeleteCategoryProductUseCase,
  IDeleteProductTransferUseCase,
  IDeleteProductUseCase,
  IGetCategoryProductUseCase,
  IGetProductTransactionUseCase,
  IGetProductUseCase,
  IGetSingleProductUseCase,
  IUpdateCategoryProductUseCase,
  IUpdateProductUseCase,
} from '../domain/usecases';
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
