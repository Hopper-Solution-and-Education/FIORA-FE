'use client';
import { type Control, type FieldErrors, useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/shared/utils';
import type { ProductFormValues } from '../schema/addProduct.schema';

interface ProductItemsFieldProps {
  control: Control<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
}

const ProductItemsField = ({ control, errors }: ProductItemsFieldProps) => {
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
          <FormLabel>Product Items</FormLabel>
          <FormDescription>
            Add items to your product. Each item should have a name and description.
          </FormDescription>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <Card key={field.id} className="border border-border">
                <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-base">Item {index + 1}</CardTitle>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="h-8 w-8 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="p-4 pt-2 space-y-3">
                  <FormField
                    control={control}
                    name={`items.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Item name"
                            {...field}
                            className={cn({
                              'border-red-500': errors.items?.[index]?.name,
                            })}
                          />
                        </FormControl>
                        {errors.items?.[index]?.name && (
                          <p className="text-sm font-medium text-destructive">
                            {errors.items[index]?.name?.message}
                          </p>
                        )}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`items.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Item description"
                            {...field}
                            className={cn('resize-none', {
                              'border-red-500': errors.items?.[index]?.description,
                            })}
                          />
                        </FormControl>
                        {errors.items?.[index]?.description && (
                          <p className="text-sm font-medium text-destructive">
                            {errors.items[index]?.description?.message}
                          </p>
                        )}
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
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
