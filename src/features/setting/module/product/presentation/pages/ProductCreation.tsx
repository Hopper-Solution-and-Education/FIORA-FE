'use client';
import Loading from '@/components/common/atoms/Loading';
import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FIREBASE_GS_URL, FIREBASE_STORAGE_URL } from '@/shared/constants';
import { useAppDispatch, useAppSelector } from '@/store';
import { yupResolver } from '@hookform/resolvers/yup';
import { isEmpty } from 'lodash';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { removeFromFirebase, uploadToFirebase } from '../../../landing/landing/firebaseUtils';
import { productDIContainer } from '../../di/productDIContainer';
import { TYPES } from '../../di/productDIContainer.type';
import { Product } from '../../domain/entities';
import { GetSingleProductUseCase } from '../../domain/usecases';

import {
  createProduct,
  deleteProductAsyncThunk,
  deleteProductTransferAsyncThunk,
  fetchCategoriesProduct,
  getProductsAsyncThunk,
  updateProductAsyncThunk,
} from '../../slices/actions';
import ProductForm from '../molecules/ProductFieldForm';
import DeleteProductDialog from '../organisms/DeleteProductDialog';
import ProductCatCreationDialog from '../organisms/ProductCatCreationDialog';
import {
  defaultProductFormValue,
  ProductFormValues,
  productSchema,
} from '../schema/addProduct.schema';

type ProductCreationType = {
  productId?: string;
};

const ProductCreation = ({ productId }: ProductCreationType) => {
  const { page, limit } = useAppSelector((state) => state.productManagement.categories);
  const isUpdatingProduct = useAppSelector((state) => state.productManagement.isUpdatingProduct);
  const isCreatingProduct = useAppSelector((state) => state.productManagement.isCreatingProduct);
  const { page: pageProduct, pageSize } = useAppSelector(
    (state) => state.productManagement.products,
  );
  const [isLoadingGetProduct, setIsLoadingGetProduct] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const productIdToTransfer = useAppSelector(
    (state) => state.productManagement.ProductIdToTransfer,
  );

  const method = useForm<ProductFormValues>({
    resolver: yupResolver(productSchema),
    defaultValues: defaultProductFormValue,
  });

  const {
    reset,
    formState: { isValid, isSubmitting },
  } = method;

  useEffect(() => {
    const handleGetProduct = async () => {
      setIsLoadingGetProduct(true);
      dispatch(getProductsAsyncThunk({ page: pageProduct, pageSize }));
      try {
        await dispatch(fetchCategoriesProduct({ page, pageSize: limit })).unwrap();

        if (productId) {
          const getSingleProductUseCase = productDIContainer.get<GetSingleProductUseCase>(
            TYPES.IGetSingleProductUseCase,
          );
          const product = await getSingleProductUseCase.execute(productId);
          if (product) {
            reset({
              id: product.id,
              icon: product.icon || '',
              name: product.name || '',
              description: product.description || '',
              price: product.price ?? 0,
              taxRate: product.taxRate ?? 0,
              type: product.type ?? '',
              catId: product.catId || '',
              items: product.items || [],
            });
          }
          setProductToEdit(product);
        }
      } catch (error: any) {
        toast.error('Error getting product', {
          description: error.message,
        });
      } finally {
        setIsLoadingGetProduct(false);
      }
    };

    handleGetProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const confirmDelete = async () => {
    if (!productToDelete?.id) return;

    const isFirebaseImage =
      productToDelete.icon &&
      (productToDelete.icon.startsWith(FIREBASE_STORAGE_URL) ||
        productToDelete.icon.startsWith(FIREBASE_GS_URL));

    if (isFirebaseImage) {
      removeFromFirebase(productToDelete.icon).catch(() => {
        console.warn('Failed to delete image from Firebase');
      });
    }

    if (!isEmpty(productToDelete.transactions)) {
      dispatch(
        deleteProductTransferAsyncThunk({
          productIdToDelete: productToDelete.id,
          productIdToTransfer,
        }),
      )
        .unwrap()
        .then(() => {
          setProductToDelete(null);
          setIsDialogOpen(false);
          router.replace('/setting/product');
        });
    } else {
      dispatch(deleteProductAsyncThunk({ id: productToDelete.id }))
        .unwrap()
        .then(() => {
          setProductToDelete(null);
          setIsDialogOpen(false);
          router.replace('/setting/product');
        });
    }
  };

  const openDeleteDialog = () => {
    setProductToDelete(productToEdit);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (data: ProductFormValues) => {
    try {
      let formattedData: ProductFormValues = {
        ...data,
        price: Number(data.price),
        taxRate: data.taxRate ? Number(data.taxRate) : null,
      };

      if (formattedData.icon && formattedData.icon.startsWith('blob:')) {
        const response = await fetch(formattedData.icon);
        const blob = await response.blob();
        const fileName = formattedData.name.replace(/\s+/g, '_').toLowerCase() + '_' + Date.now();
        const firebaseUrl = await uploadToFirebase({
          file: blob,
          path: 'images/product_icons',
          fileName,
        });
        formattedData = {
          ...formattedData,
          icon: firebaseUrl,
        };
      }

      if (productId) {
        await dispatch(updateProductAsyncThunk(formattedData))
          .unwrap()
          .then(() => {
            router.replace('/setting/product');
          });
        return;
      }

      await dispatch(createProduct(formattedData))
        .unwrap()
        .then(() => {
          method.reset(defaultProductFormValue);
          router.replace('/setting/product');
        });
    } catch (error) {
      console.error('Error creating/updating product:', error);
    }
  };

  const renderSubmitButtonDefault = () => (
    <TooltipProvider>
      <div className="flex justify-between gap-4 mt-6">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              type="button"
              onClick={() => router.back()}
              className="w-32 h-12 flex items-center justify-center border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white transition-colors duration-200"
            >
              <Icons.circleArrowLeft className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Cancel and go back</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="submit"
              disabled={!isValid || isCreatingProduct || isUpdatingProduct}
              className="w-32 h-12 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isSubmitting ? (
                <Icons.spinner className="animate-spin h-5 w-5" />
              ) : (
                <Icons.check className="h-5 w-5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isSubmitting ? 'Submiting...' : 'Submit'}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );

  return (
    <section className="mb-10">
      <FormProvider {...method}>
        <>{isLoadingGetProduct && <Loading />}</>
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold">
              {productId ? `Edit Product: ${productToEdit?.name ?? ''}` : 'Create New Product'}
            </h1>

            <Button disabled={!productId} type="button" variant="ghost" onClick={openDeleteDialog}>
              <Trash2 color="red" className="h-4 w-4" />
            </Button>
          </div>

          {/* Form tạo/cập nhật sản phẩm */}
          <form onSubmit={method.handleSubmit(handleSubmit)} id="hook-form">
            <div className="mb-6">
              <ProductForm method={method} productToEdit={productToEdit} />
            </div>

            {renderSubmitButtonDefault()}
          </form>

          <ProductCatCreationDialog />
          <DeleteProductDialog
            product={productToDelete}
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onConfirm={confirmDelete}
          />
        </div>
      </FormProvider>
    </section>
  );
};

export default ProductCreation;
