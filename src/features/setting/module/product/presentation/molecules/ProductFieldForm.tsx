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
        <div className="space-y-4">
          <ProductIconField control={method.control} />
          <ProductNameField control={method.control} />
          <ProductTypeField control={method.control} />
          <ProductCategoryField control={method.control} />
          <PriceField control={method.control} />
          <TaxRateField control={method.control} />
          <ProductDescriptionField control={method.control} />
          <ProductItemsField control={method.control} />
        </div>
      </div>
    </>
  );
};

export default ProductForm;
