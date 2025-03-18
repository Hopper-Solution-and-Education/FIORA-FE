'use client';

import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { useAppSelector } from '@/store';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import PriceField from '../atoms/PriceField';
import ProductCategoryField from '../atoms/ProductCategoryField';
import ProductDescriptionField from '../atoms/ProductDescriptionField';
import ProductIconField from '../atoms/ProductIconField';
import ProductItemsField from '../atoms/ProductItemsField';
import ProductNameField from '../atoms/ProductNameField';
import ProductTypeField from '../atoms/ProductTypeField';
import TaxRateField from '../atoms/TaxRateField';
import { type ProductFormValues, productSchema } from '../schema/addProduct.schema';
import Loading from '@/components/common/Loading';

interface ProductFormProps {
  onSubmit: (data: ProductFormValues) => Promise<void>;
  onCancel: () => void;
}

const ProductForm = ({ onSubmit, onCancel }: ProductFormProps) => {
  const isCreatingProduct = useAppSelector((state) => state.productManagement.isCreatingProduct);

  const method = useForm<ProductFormValues>({
    resolver: yupResolver(productSchema),
    defaultValues: {
      icon: '',
      name: '',
      description: '',
      price: undefined,
      taxRate: undefined,
      type: undefined,
      category_id: '',
      items: [],
    },
  });

  return (
    <Form {...method}>
      <>{isCreatingProduct && <Loading />}</>
      <form onSubmit={method.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProductTypeField control={method.control} errors={method.formState.errors} />
          <ProductNameField control={method.control} errors={method.formState.errors} />
          <ProductCategoryField control={method.control} errors={method.formState.errors} />
          <PriceField control={method.control} errors={method.formState.errors} />
          <TaxRateField control={method.control} errors={method.formState.errors} />
        </div>

        <ProductDescriptionField control={method.control} errors={method.formState.errors} />
        <ProductIconField control={method.control} />
        <ProductItemsField control={method.control} errors={method.formState.errors} />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button disabled={isCreatingProduct} type="submit">
            {isCreatingProduct ? 'Creating...' : 'Create Product'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default ProductForm;
