'use client';
import { useAppDispatch, useAppSelector } from '@/store';
import { yupResolver } from '@hookform/resolvers/yup';
import { CategoryType } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import IconSelect from '@/components/common/atoms/IconSelect';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
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
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  defaultUpdateCategoryValues,
  UpdateCategoryDefaultValues,
  validateUpdateCategorySchema,
} from '@/features/home/module/category/slices/utils/formSchema';
import { updateCategory } from '@/features/home/module/category/slices/actions';
import { Category } from '@/features/home/module/category/slices/types';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Icons } from '@/components/Icon';
import DeleteDialog from './DeleteDialog';
import { setDeleteConfirmOpen, setSelectedCategory } from '@/features/home/module/category/slices';

interface UpdateCategoryFormProps {
  initialData?: Category;
}

export default function UpdateCategoryForm({ initialData }: UpdateCategoryFormProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { categories } = useAppSelector((state) => state.category);

  const form = useForm<UpdateCategoryDefaultValues>({
    resolver: yupResolver(validateUpdateCategorySchema),
    defaultValues: defaultUpdateCategoryValues,
    mode: 'onChange',
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name || '',
        type: initialData.type || CategoryType.Expense,
        icon: initialData.icon || '',
        description: initialData.description || '',
        parentId: initialData.parentId || null,
        isTypeDisabled: initialData.parentId ? true : false,
      });
    }
  }, [initialData, form]);

  const onSubmit = async (data: UpdateCategoryDefaultValues) => {
    try {
      const updatedCategory: UpdateCategoryDefaultValues = {
        ...initialData,
        name: data.name,
        type: data.type,
        icon: data.icon,
        description: data.description ?? undefined,
        parentId: data.parentId,
        isTypeDisabled: data.isTypeDisabled ?? false,
      };
      await dispatch(updateCategory(updatedCategory)).unwrap();
      toast.success('Category updated successfully');
      router.push('/home/category');
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
    }
  };

  const handleChangeParentCategory = (value: string | null, field: any) => {
    if (value && value !== 'null') {
      const parentCategory = categories.data?.find((category: Category) => category.id === value);
      if (parentCategory?.type) {
        form.setValue('type', parentCategory.type);
        form.setValue('isTypeDisabled', true);
      }
    } else {
      form.setValue('isTypeDisabled', false);
    }
    field.onChange(value === 'null' ? null : value);
  };

  const handleDeleteClick = () => {
    if (!initialData) return;
    dispatch(setSelectedCategory(initialData));
    dispatch(setDeleteConfirmOpen(true));
  };

  const isTypeDisabled = form.watch('isTypeDisabled');
  const isParentDisabled = initialData?.parentId ? true : false;
  const parentOptions =
    categories.data?.filter(
      (category: Category) => category.id !== initialData?.id && !category.parentId,
    ) || [];

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Category Name <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Category Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Icon <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <IconSelect selectedIcon={field.value} onIconChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Category Type <span className="text-red-500">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isTypeDisabled}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category Type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={CategoryType.Expense}>Expense</SelectItem>
                      <SelectItem value={CategoryType.Income}>Income</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="parentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent Category (Optional)</FormLabel>
                <Select
                  onValueChange={(value) => handleChangeParentCategory(value, field)}
                  value={field.value || 'null'}
                  disabled={isParentDisabled}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Parent Category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {isParentDisabled ? (
                        <SelectItem value="null">Subcategories exist. Parent locked</SelectItem>
                      ) : (
                        <SelectItem value="null">None</SelectItem>
                      )}
                      {parentOptions.map((category: Category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Type your description here"
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between">
            <Button
              variant="ghost"
              type="button"
              onClick={handleDeleteClick}
              className="text-red-500 hover:text-red-700 hover:bg-red-100"
            >
              <Icons.trash className="h-4 w-4" />
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={!form.formState.isValid}>
                Submit
              </Button>
            </div>
          </div>
        </form>
      </Form>
      <DeleteDialog />
    </>
  );
}
