'use client';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store';
import { yupResolver } from '@hookform/resolvers/yup';
import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { removeFromFirebase, uploadToFirebase } from '../../../landing/landing/firebaseUtils';
import { productDIContainer } from '../../di/productDIContainer';
import { TYPES } from '../../di/productDIContainer.type';
import { Product } from '../../domain/entities/Product';
import { GetSingleProductUseCase } from '../../domain/usecases/GetSingleProductUsecase';
import { setDialogState } from '../../slices';
import { createProduct } from '../../slices/actions/createProductAsyncThunk';
import { deleteProductAsyncThunk } from '../../slices/actions/deleteProductAsyncThunk';
import { updateProductAsyncThunk } from '../../slices/actions/updateProductAsyncThunk';
import ProductForm from '../molecules/ProductFieldForm';
import {
  defaultProductFormValue,
  ProductFormValues,
  productSchema,
} from '../schema/addProduct.schema';
import Loading from '@/components/common/atoms/Loading';

type ProductCreationType = {
  productId?: string;
};

const ProductCreation = ({ productId }: ProductCreationType) => {
  const isUpdatingProduct = useAppSelector((state) => state.productManagement.isUpdatingProduct);
  const isCreatingProduct = useAppSelector((state) => state.productManagement.isCreatingProduct);
  const dialogState = useAppSelector((state) => state.productManagement.dialogState);
  const [isLoadingGetProduct, setIsLoadingGetProduct] = useState(false);
  const dispatch = useAppDispatch();

  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const method = useForm<ProductFormValues>({
    resolver: yupResolver(productSchema),
    defaultValues: defaultProductFormValue,
  });

  const { reset } = method;

  useEffect(() => {
    const handleGetProduct = async () => {
      setIsLoadingGetProduct(true);
      try {
        if (productId) {
          const getSingleProductUseCase = productDIContainer.get<GetSingleProductUseCase>(
            TYPES.IGetSingleProductUseCase,
          );
          const product = await getSingleProductUseCase.execute(productId);

          if (product) {
            dispatch(setDialogState('edit'));
            reset({
              id: product.id,
              icon: product.icon || '',
              name: product.name || '',
              description: product.description || '',
              price: product.price ?? 0,
              taxRate: product.taxRate ?? 0,
              type: product.type ?? '',
              categoryId: product.categoryId || '',
              items: product.items || [],
            });
          }
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
      (productToDelete.icon.startsWith('https://firebasestorage.googleapis.com') ||
        productToDelete.icon.startsWith('gs://'));

    if (isFirebaseImage) {
      await removeFromFirebase(productToDelete.icon);
    }

    dispatch(deleteProductAsyncThunk({ id: productToDelete.id }));
    setProductToDelete(null);
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

      if (dialogState === 'add') {
        await dispatch(createProduct(formattedData))
          .unwrap()
          .then(() => {
            method.reset(defaultProductFormValue);
          });
      } else if (dialogState === 'edit') {
        await dispatch(updateProductAsyncThunk(formattedData))
          .unwrap()
          .then(() => {
            method.reset(defaultProductFormValue);
          });
      }
    } catch (error) {
      console.error('Error creating/updating product:', error);
    }
  };

  return (
    <FormProvider {...method}>
      <>{isLoadingGetProduct && <Loading />}</>
      <div className="mx-auto">
        <h1 className="text-2xl font-bold mb-4">
          {dialogState === 'add' ? 'Create New Product' : 'Edit Product'}
        </h1>

        {/* Form tạo/cập nhật sản phẩm */}
        <form onSubmit={method.handleSubmit(handleSubmit)} id="hook-form">
          <div className="mb-6">
            <ProductForm method={method} />
          </div>

          <div className="flex justify-between items-center">
            {dialogState === 'edit' && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  const product: Product = {
                    id: method.getValues('id') ?? '',
                    name: method.getValues('name'),
                    description: method.getValues('description') ?? '',
                    icon: method.getValues('icon'),
                    type: method.getValues('type'),
                    price: method.getValues('price'),
                    taxRate: parseFloat(String(method.getValues('taxRate') ?? '0')),
                    categoryId: method.getValues('categoryId'),
                    items:
                      method.getValues('items')?.map((item) => ({
                        name: item.name ?? '',
                        description: item.description ?? undefined,
                      })) ?? [],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  };

                  setProductToDelete(product);
                }}
              >
                <Trash2 color="red" className="h-4 w-4" />
              </Button>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => method.reset(defaultProductFormValue)}
              >
                Cancel
              </Button>
              <Button
                disabled={isCreatingProduct || isUpdatingProduct}
                type="submit"
                form="hook-form"
              >
                {dialogState === 'add'
                  ? isCreatingProduct
                    ? 'Creating...'
                    : 'Create Product'
                  : isUpdatingProduct
                    ? 'Updating...'
                    : 'Update Product'}
              </Button>
            </div>
          </div>
        </form>

        {productToDelete && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Confirm Delete</h2>
            <Button type="button" variant="destructive" onClick={confirmDelete}>
              Delete Product
            </Button>
          </div>
        )}
      </div>
    </FormProvider>
  );
};

export default ProductCreation;
