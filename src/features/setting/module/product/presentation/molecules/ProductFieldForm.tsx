'use client';

import Loading from '@/components/common/atoms/Loading';
import { useAppSelector } from '@/store';
import { UseFormReturn } from 'react-hook-form';
import PriceField from '../atoms/PriceField';
import ProductCategoryField from '../atoms/ProductCategoryField';
import ProductDescriptionField from '../atoms/ProductDescriptionField';
import ProductIconField from '../atoms/ProductIconField';
import ProductItemsField from '../atoms/ProductItemsField';
import ProductNameField from '../atoms/ProductNameField';
import ProductTypeField from '../atoms/ProductTypeField';
import TaxRateField from '../atoms/TaxRateField';
import { type ProductFormValues } from '../schema/addProduct.schema';

interface ProductFormProps {
  method: UseFormReturn<ProductFormValues>;
}

const ProductForm = ({ method }: ProductFormProps) => {
  const isCreatingProduct = useAppSelector((state) => state.productManagement.isCreatingProduct);
  const isUpdatingProduct = useAppSelector((state) => state.productManagement.isUpdatingProduct);

  return (
    <>
      {(isCreatingProduct || isUpdatingProduct) && <Loading />}
      <div className="mx-auto">
        {/* Left column: các field hiện tại */}
        <div className="space-y-4">
          <ProductIconField control={method.control} />
          <ProductNameField control={method.control} errors={method.formState.errors} />
          <ProductTypeField control={method.control} errors={method.formState.errors} />
          <ProductCategoryField control={method.control} errors={method.formState.errors} />
          <PriceField control={method.control} errors={method.formState.errors} />
          <TaxRateField control={method.control} errors={method.formState.errors} />
          <ProductDescriptionField control={method.control} errors={method.formState.errors} />
          <ProductItemsField control={method.control} errors={method.formState.errors} />
        </div>
      </div>
    </>
  );
};

export default ProductForm;
