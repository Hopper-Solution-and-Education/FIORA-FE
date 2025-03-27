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
      <div className="m-2 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column: các field hiện tại */}
        <div className="space-y-4">
          <ProductIconField control={method.control} />
          <ProductTypeField control={method.control} errors={method.formState.errors} />
          <ProductNameField control={method.control} errors={method.formState.errors} />
          <ProductCategoryField control={method.control} errors={method.formState.errors} />
          <PriceField control={method.control} errors={method.formState.errors} />
          <TaxRateField control={method.control} errors={method.formState.errors} />
          <ProductDescriptionField control={method.control} errors={method.formState.errors} />
        </div>

        {/* Right column: ProductItemsField */}
        <div>
          <ProductItemsField control={method.control} errors={method.formState.errors} />
        </div>
      </div>
    </>
  );
};

export default ProductForm;
