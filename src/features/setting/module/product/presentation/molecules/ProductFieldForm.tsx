'use client';

import { UseFormReturn } from 'react-hook-form';
import PriceField from '../atoms/PriceField';

import { Product } from '../../domain/entities';
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
  productToEdit: Product | null;
}

const ProductForm = ({ method, productToEdit }: ProductFormProps) => {
  return (
    <>
      <div className="mx-auto">
        <div className="space-y-4">
          <ProductIconField control={method.control} productToEdit={productToEdit} />
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
