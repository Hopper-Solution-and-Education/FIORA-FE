'use client';
import Loading from '@/components/common/atoms/Loading';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAppDispatch, useAppSelector } from '@/store';
import { yupResolver } from '@hookform/resolvers/yup';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { removeFromFirebase, uploadToFirebase } from '../../../landing/landing/firebaseUtils';
import { productDIContainer } from '../../di/productDIContainer';
import { TYPES } from '../../di/productDIContainer.type';
import { Product } from '../../domain/entities/Product';
import { GetSingleProductUseCase } from '../../domain/usecases/GetSingleProductUsecase';
import { createProduct } from '../../slices/actions/createProductAsyncThunk';
import { deleteProductAsyncThunk } from '../../slices/actions/deleteProductAsyncThunk';
import { fetchCategoriesProduct } from '../../slices/actions/fetchCategoriesProduct';
import { updateProductAsyncThunk } from '../../slices/actions/updateProductAsyncThunk';
import ProductForm from '../molecules/ProductFieldForm';
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
  const [isLoadingGetProduct, setIsLoadingGetProduct] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const method = useForm<ProductFormValues>({
    resolver: yupResolver(productSchema),
    defaultValues: defaultProductFormValue,
  });

  const {
    reset,
    formState: { isValid },
  } = method;

  useEffect(() => {
    const handleGetProduct = async () => {
      setIsLoadingGetProduct(true);
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
    setIsDialogOpen(false);
    router.replace('/setting/product');
  };

  const openDeleteDialog = () => {
    const product: Product = {
      id: method.getValues('id') ?? '',
      name: method.getValues('name'),
      description: method.getValues('description') ?? '',
      icon: method.getValues('icon'),
      type: method.getValues('type'),
      price: method.getValues('price'),
      taxRate: parseFloat(String(method.getValues('taxRate') ?? '0')),
      categoryId: method.getValues('categoryId'),
      items: method.getValues('items') || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProductToDelete(product);
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
            method.reset(defaultProductFormValue);
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

      console.log('back to product page');
    } catch (error) {
      console.error('Error creating/updating product:', error);
    }
  };

  return (
    <section className="mb-10">
      <FormProvider {...method}>
        <>{isLoadingGetProduct && <Loading />}</>
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="text-2xl font-bold mb-4">
            {productId ? 'Edit Product' : 'Create New Product'}
          </h1>

          {/* Form tạo/cập nhật sản phẩm */}
          <form onSubmit={method.handleSubmit(handleSubmit)} id="hook-form">
            <div className="mb-6">
              <ProductForm method={method} />
            </div>

            <div className="flex justify-between items-center">
              {productId && (
                <Button type="button" variant="ghost" onClick={openDeleteDialog}>
                  <Trash2 color="red" className="h-4 w-4" />
                </Button>
              )}
              <div className="flex gap-3">
                <Button
                  disabled={!isValid || isCreatingProduct || isUpdatingProduct}
                  type="submit"
                  form="hook-form"
                >
                  {productId
                    ? isUpdatingProduct
                      ? 'Updating...'
                      : 'Update Product'
                    : isCreatingProduct
                      ? 'Creating...'
                      : 'Create Product'}
                </Button>
              </div>
            </div>
          </form>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Delete</DialogTitle>
              </DialogHeader>
              <p>Are you sure you want to delete this product? This action cannot be undone.</p>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={confirmDelete}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </FormProvider>
    </section>
  );
};

export default ProductCreation;
