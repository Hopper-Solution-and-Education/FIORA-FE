'use client';

import Loading from '@/components/common/Loading';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  const dialogState = useAppSelector((state) => state.productManagement.dialogState);

  return (
    <>
      <>{(isCreatingProduct || isUpdatingProduct) && <Loading />}</>
      {/* <form onSubmit={method.handleSubmit(onSubmit)} className="space-y-6"> */}
      <ScrollArea className="max-w-[100%]">
        <div className="m-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProductIconField control={method.control} />
            <ProductTypeField control={method.control} errors={method.formState.errors} />
            <ProductNameField control={method.control} errors={method.formState.errors} />
            <ProductCategoryField control={method.control} errors={method.formState.errors} />
            <PriceField control={method.control} errors={method.formState.errors} />
            <TaxRateField control={method.control} errors={method.formState.errors} />
          </div>

          <ProductDescriptionField control={method.control} errors={method.formState.errors} />
          <ProductItemsField control={method.control} errors={method.formState.errors} />
        </div>
      </ScrollArea>
    </>
  );
};

export default ProductForm;
