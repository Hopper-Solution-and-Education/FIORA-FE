'use client';

import { UseFormReturn } from 'react-hook-form';
import PriceField from '../atoms/PriceField';

import {
  ProductCategoryField,
  ProductDescriptionField,
  ProductIconField,
  ProductItemsField,
  ProductNameField,
  ProductTypeField,
  TaxRateField,
} from '../atoms';
import { type ProductFormValues } from '../schema';

interface ProductFormProps {
  method: UseFormReturn<ProductFormValues>;
}

const ProductForm = ({ method }: ProductFormProps) => {
  return (
    <>
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
