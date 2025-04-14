import { FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { isImageFile, isUrl } from '@/shared/lib/utils';
import { useEffect, useState } from 'react';
import { useFormContext, type Control } from 'react-hook-form';
import { Product } from '../../domain/entities';
import { ProductFormValues } from '../schema';
import IconSelect from './IconSelect';
import IconUploader from './IconUploader';

interface ProductIconFieldProps {
  control: Control<ProductFormValues>;
  productToEdit: Product | null;
}

type ProductIconFormType = 'dropdown' | 'uploader';

const ProductIconField = ({ control, productToEdit }: ProductIconFieldProps) => {
  const { watch, setValue } = useFormContext<ProductFormValues>();
  const fieldValue = watch('icon');

  const [selectedTab, setSelectedTab] = useState<ProductIconFormType>(
    fieldValue && isUrl(fieldValue) ? 'uploader' : 'dropdown',
  );

  useEffect(() => {
    if (fieldValue) {
      setSelectedTab(isUrl(fieldValue) || isImageFile(fieldValue) ? 'uploader' : 'dropdown');
    }
  }, [fieldValue]);

  // để chắc rằng field icon sẽ được nhận
  useEffect(() => {
    if (productToEdit?.icon) {
      setValue('icon', productToEdit.icon);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productToEdit]);

  const handleOnTabChange = (newTab: string) => {
    setSelectedTab(newTab as ProductIconFormType);
  };

  return (
    <FormField
      control={control}
      name="icon"
      render={({ field }) => (
        <FormItem className="col-span-2">
          <label className="block text-sm font-medium mb-2">
            Icon <span className="text-red-500">*</span>
          </label>
          <Tabs value={selectedTab} onValueChange={handleOnTabChange}>
            <TabsList>
              <TabsTrigger value="dropdown">Select Icon</TabsTrigger>
              <TabsTrigger value="uploader">Upload Icon</TabsTrigger>
            </TabsList>

            <TabsContent value="uploader">
              <IconUploader field={field} maxSize={2 * 1024 * 1024} />
            </TabsContent>

            <TabsContent value="dropdown">
              <IconSelect field={field} />
            </TabsContent>
          </Tabs>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ProductIconField;
