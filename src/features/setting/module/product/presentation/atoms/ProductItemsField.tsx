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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { iconOptions } from '@/shared/constants/data';
import { cn, useGetIconLabel } from '@/shared/utils';
import { Plus } from 'lucide-react';
import { type Control, useFieldArray, useFormContext } from 'react-hook-form';
import type { ProductFormValues } from '../schema/addProduct.schema';

interface ListIconProps {
  icon: string;
}
interface ProductItemsFieldProps {
  control: Control<ProductFormValues>;
}

const ListIcon: React.FC<ListIconProps> = ({ icon }) => {
  const Icon = Icons[icon as keyof typeof Icons] || Icons['circle'];
  const iconLabel = useGetIconLabel(icon);
  return (
    <div className="flex items-center gap-2">
      {Icon ? <Icon className="w-4 h-4" /> : <span>No Icon</span>}
      <span>{iconLabel || icon}</span>
    </div>
  );
};

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
    append({ name: '', description: '', itemIcon: '' });
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
                  <FormLabel className="text-sm font-medium">
                    Name
                    <span className="pl-1 text-red-500 dark:text-red-400" aria-hidden="true">
                      *
                    </span>
                  </FormLabel>
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
                  <FormLabel className="text-sm font-medium">
                    Description
                    <span className="pl-1 text-red-500 dark:text-red-400" aria-hidden="true">
                      *
                    </span>
                  </FormLabel>
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

                <FormField
                  control={control}
                  name={`items.${index}.itemIcon`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Icon
                        <span className="pl-1 text-red-500 dark:text-red-400" aria-hidden="true">
                          *
                        </span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue>
                              {field.value ? <ListIcon icon={field.value} /> : 'Select an icon'}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="h-60 overflow-y-auto">
                          {iconOptions.map((data) => (
                            <SelectGroup key={data.label}>
                              <SelectLabel>{data.label}</SelectLabel>
                              {data.options.map((item) => (
                                <SelectItem key={item.value} value={item.value}>
                                  <div className="flex items-center gap-2">
                                    {item.icon ? (
                                      <item.icon className="w-4 h-4" />
                                    ) : (
                                      <span>No Icon</span>
                                    )}
                                    <span>{item.label}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.items?.[index]?.itemIcon && (
                        <p className="text-sm font-medium text-destructive">
                          {errors.items[index]?.itemIcon?.message}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
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
