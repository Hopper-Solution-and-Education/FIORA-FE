// src/store/slices/categorySlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import { CategoryProductGetResponse } from '../domain/entities/Category';
import { createCategoryProductAsyncThunk } from './actions/createCategoryProductAsyncThunk';
import { createProduct } from './actions/createProductAsyncThunk';
import { deleteCategoryProductAsyncThunk } from './actions/deleteCategoryProductAsyncThunk';
import { deleteProductAsyncThunk } from './actions/deleteProductAsyncThunk';
import { fetchCategoriesProduct } from './actions/fetchCategoriesProduct';
import { getProductsAsyncThunk } from './actions/getProductsAsyncThunk';
import { getProductTransactionAsyncThunk } from './actions/getProductTransactionAsyncThunk';
import { updateCategoryProductAsyncThunk } from './actions/updateCategoryProductAsyncThunk';
import { updateProductAsyncThunk } from './actions/updateProductAsyncThunk';
import { initialProductState } from './types';

const productManagementSlice = createSlice({
  name: 'productManagement',
  initialState: initialProductState,
  reducers: {
    updateProductListItems: (state, action) => {
      state.products.items = action.payload;
    },
    setIsOpenDialogAddCategory: (state, action) => {
      state.isOpenDialogAddCategory = action.payload;
    },
    resetProductManagementState: () => initialProductState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoriesProduct.pending, (state) => {
        state.categories.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchCategoriesProduct.fulfilled,
        (state, action: PayloadAction<CategoryProductGetResponse>) => {
          const { data, page, pageSize, totalPage } = action.payload;
          state.categories = {
            isLoading: false,
            data: data,
            page: page,
            limit: pageSize,
            total: totalPage,
            hasMore: page < totalPage,
          };
        },
      )
      .addCase(fetchCategoriesProduct.rejected, (state, action) => {
        state.categories.isLoading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      });

    builder
      .addCase(createProduct.pending, (state) => {
        state.isCreatingProduct = true;
      })
      .addCase(createProduct.fulfilled, (state) => {
        state.isCreatingProduct = false;

        toast.success('Success', {
          description: 'Create product successfully!!',
        });
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isCreatingProduct = false;
        toast.error('Failed to create product', {
          description: (state.error = action.error.message || 'Failed to create product'),
        });
      });

    builder
      .addCase(getProductsAsyncThunk.pending, (state) => {
        state.products.isLoading = true;
      })
      .addCase(getProductsAsyncThunk.fulfilled, (state, action) => {
        state.products.isLoading = false;
        state.products.items = action.payload.data;
        state.products.total = action.payload.totalPage;
        state.products.page = action.payload.page;
      })
      .addCase(getProductsAsyncThunk.rejected, (state, action) => {
        state.products.isLoading = false;
        state.error = action.error.message || 'Failed to get products';
      });

    builder
      .addCase(updateProductAsyncThunk.pending, (state) => {
        state.isUpdatingProduct = true;
      })
      .addCase(updateProductAsyncThunk.fulfilled, (state, action) => {
        state.isUpdatingProduct = false;

        const updatedProduct = action.payload;
        const index = state.products.items.findIndex((item) => item.id === updatedProduct.id);

        if (index !== -1) {
          state.products.items[index] = updatedProduct;
        }

        toast.success('Success', {
          description: 'Update product successfully!!',
        });
      })
      .addCase(updateProductAsyncThunk.rejected, (state, action) => {
        state.isUpdatingProduct = false;
        state.error = action.error.message || 'Failed to update product';
      });

    builder
      .addCase(deleteProductAsyncThunk.pending, (state) => {
        state.isDeletingProduct = true;
      })
      .addCase(deleteProductAsyncThunk.fulfilled, (state, action) => {
        state.isDeletingProduct = false;
        const deletedProductId = action.payload.id;
        state.products.items = state.products.items.filter((item) => item.id !== deletedProductId);
        toast.success('Success', {
          description: 'Delete product successfully!!',
        });
      })
      .addCase(deleteProductAsyncThunk.rejected, (state, action) => {
        state.isDeletingProduct = false;
        state.error = action.error.message || 'Failed to delete product';
      });

    builder.addCase(getProductTransactionAsyncThunk.pending, (state) => {
      state.productTransaction.isLoadingGet = true;
    });

    builder.addCase(getProductTransactionAsyncThunk.fulfilled, (state, action) => {
      state.productTransaction.isLoadingGet = false;

      if (action.payload.page === 1) {
        state.productTransaction.data = action.payload.data;
      } else {
        state.productTransaction.data = [...state.productTransaction.data, ...action.payload.data];
      }

      state.productTransaction.total = action.payload.totalPage;
      state.productTransaction.page = action.payload.page;
      state.productTransaction.hasMore = action.payload.page < action.payload.totalPage;
    });

    builder.addCase(getProductTransactionAsyncThunk.rejected, (state) => {
      state.productTransaction.isLoadingGet = false;
    });

    builder.addCase(createCategoryProductAsyncThunk.pending, (state) => {
      state.isCreatingProductCategory = true;
    });

    builder.addCase(createCategoryProductAsyncThunk.fulfilled, (state, action) => {
      state.isCreatingProductCategory = false;
      console.log(action.payload);

      state.categories.data = [
        ...state.categories.data,
        {
          id: action.payload.id,
          userId: action.payload.id,
          icon: action.payload.icon,
          name: action.payload.name,
          description: action.payload.description,
          taxRate: action.payload.taxRate,
        },
      ];
      toast.success('Success', {
        description: 'Create category successfully!!',
      });
    });

    builder.addCase(createCategoryProductAsyncThunk.rejected, (state, action) => {
      state.isCreatingProductCategory = false;
      state.error = action.error.message || 'Failed to create category';
    });

    builder
      .addCase(updateCategoryProductAsyncThunk.pending, (state) => {
        state.isUpdatingProductCategory = true;
      })
      .addCase(updateCategoryProductAsyncThunk.fulfilled, (state, action) => {
        state.isUpdatingProductCategory = false;
        const updatedCategory = action.payload;
        const index = state.categories.data.findIndex((item) => item.id === updatedCategory.id);

        if (index !== -1) {
          state.categories.data[index] = updatedCategory;
        }
        toast.success('Success', {
          description: 'Update category successfully!!',
        });
      })
      .addCase(updateCategoryProductAsyncThunk.rejected, (state, action) => {
        state.isUpdatingProductCategory = false;
        state.error = action.error.message || 'Failed to update category';
      });

    builder
      .addCase(deleteCategoryProductAsyncThunk.pending, (state) => {
        state.isDeletingProductCategory = true;
      })
      .addCase(deleteCategoryProductAsyncThunk.fulfilled, (state, action) => {
        state.isDeletingProductCategory = false;
        const deletedCategoryId = action.payload.categoryProductId;
        state.categories.data = state.categories.data.filter(
          (item) => item.id !== deletedCategoryId,
        );
        toast.success('Success', {
          description: 'Delete category successfully!!',
        });
      })
      .addCase(deleteCategoryProductAsyncThunk.rejected, (state, action) => {
        state.isDeletingProductCategory = false;
        state.error = action.error.message || 'Failed to delete category';
      });
  },
});

export const { resetProductManagementState, updateProductListItems, setIsOpenDialogAddCategory } =
  productManagementSlice.actions;
export default productManagementSlice.reducer;
