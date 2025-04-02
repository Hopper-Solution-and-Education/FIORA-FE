'use client';
import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/shared/utils';
import { Plus } from 'lucide-react';
import { type Control, useFieldArray, useFormContext } from 'react-hook-form';
import type { ProductFormValues } from '../schema/addProduct.schema';

interface ProductItemsFieldProps {
  control: Control<ProductFormValues>;
}

const ProductItemsField = ({ control }: ProductItemsFieldProps) => {
  const method = useFormContext<ProductFormValues>();

  const {
    formState: { errors },
  } = method;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const addNewItem = () => {
    append({ name: '', description: '' });
  };

  return (
    <FormField
      control={control}
      name="items"
      render={() => (
        <FormItem className="col-span-2">
          <FormLabel className="font-semibold">Product Items</FormLabel>
          <FormDescription className="text-gray-600 mb-4">
            Add items to your product. Each item should have a name and description.
          </FormDescription>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 border border-gray-300 rounded-lg shadow-sm relative"
              >
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute top-2 right-2 text-destructive hover:bg-gray-100 rounded-full p-1"
                >
                  <Icons.trash className="h-4 w-4" />
                </button>

                <div className="mb-3">
                  <FormLabel className="text-sm font-medium">Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Item name"
                      {...control.register(`items.${index}.name`)}
                      className={cn('mt-1', {
                        'border-red-500': errors.items?.[index]?.name,
                      })}
                    />
                  </FormControl>
                  {errors.items?.[index]?.name && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.items[index]?.name?.message}
                    </p>
                  )}
                </div>

                <div>
                  <FormLabel className="text-sm font-medium">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Item description"
                      {...control.register(`items.${index}.description`)}
                      className={cn('resize-none mt-1', {
                        'border-red-500': errors.items?.[index]?.description,
                      })}
                    />
                  </FormControl>
                  {errors.items?.[index]?.description && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.items[index]?.description?.message}
                    </p>
                  )}
                </div>
              </div>
            ))}

            <Button type="button" variant="outline" onClick={addNewItem} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ProductItemsField;
