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
  defaultNewCategoryValues,
  NewCategoryDefaultValues,
  validateNewCategorySchema,
} from '@/features/home/module/category/slices/utils/formSchema';
import { createCategory } from '@/features/home/module/category/slices/actions';
import { useRouter } from 'next/navigation';
import { Category } from '@/features/home/module/category/slices/types';

interface CreateCategoryFormProps {
  initialData?: NewCategoryDefaultValues;
}

export default function CreateCategoryForm({ initialData }: CreateCategoryFormProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { categories } = useAppSelector((state) => state.category);

  const form = useForm<NewCategoryDefaultValues>({
    resolver: yupResolver(validateNewCategorySchema),
    defaultValues: initialData || defaultNewCategoryValues,
    mode: 'onChange',
  });

  const onSubmit = async (data: NewCategoryDefaultValues) => {
    try {
      await dispatch(createCategory(data)).unwrap();
      toast.success('Category created successfully');
      form.reset();
      router.push('/home/category');
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Failed to create category');
    }
  };

  const handleChangeParentCategory = (value: string | null, field: any) => {
    console.log('value', value);
    if (value && value !== 'null') {
      const parentCategory = categories.data?.find((category: Category) => category.id === value);
      if (parentCategory?.type) {
        console.log('parentCategory', parentCategory);
        form.setValue('type', parentCategory.type);
        form.setValue('isTypeDisabled', true);
      }
    } else {
      form.setValue('type', CategoryType.Expense);
      form.setValue('isTypeDisabled', false);
    }
    field.onChange(value === 'null' ? null : value);
  };

  // Add isTypeDisabled to the form default values if not already present
  const isTypeDisabled = form.watch('isTypeDisabled') || false;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon</FormLabel>
              <FormControl>
                <IconSelect selectedIcon={field.value} onIconChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Category Name" {...field} />
              </FormControl>
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
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="null">None</SelectItem>
                    {categories.data?.map((category) => (
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
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={isTypeDisabled}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category type" />
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Category description" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Submitting...' : 'Create Category'}
        </Button>
      </form>
    </Form>
  );
}
