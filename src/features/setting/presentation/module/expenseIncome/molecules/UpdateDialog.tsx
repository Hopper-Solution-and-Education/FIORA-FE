'use client';
import IconSelect from '@/components/common/IconSelect';
import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
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
  setDeleteConfirmOpen,
  setSelectedCategory,
  setUpdateDialogOpen,
} from '@/features/setting/presentation/settingSlices/expenseIncomeSlides';
import {
  fetchCategories,
  updateCategory,
} from '@/features/setting/presentation/settingSlices/expenseIncomeSlides/actions';
import { Category } from '@/features/setting/presentation/settingSlices/expenseIncomeSlides/types';
import {
  defaultUpdateCategoryValues,
  UpdateCategoryDefaultValues,
  validateUpdateCategorySchema,
} from '@/features/setting/presentation/settingSlices/expenseIncomeSlides/utils/formSchema';
import { iconOptions } from '@/shared/constants/data';
import { useAppDispatch, useAppSelector } from '@/store';
import { yupResolver } from '@hookform/resolvers/yup';
import { CategoryType } from '@prisma/client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const UpdateDialog: React.FC = () => {
  const dispatch = useAppDispatch();
  const { categories, selectedCategory, updateDialogOpen } = useAppSelector(
    (state) => state.expenseIncome,
  );

  // * FORM HANDLING ZONE *
  const form = useForm<UpdateCategoryDefaultValues>({
    resolver: yupResolver(validateUpdateCategorySchema),
    defaultValues: defaultUpdateCategoryValues,
    mode: 'onChange', // Add this to validate on change
  });

  useEffect(() => {
    if (selectedCategory) {
      form.reset({
        name: selectedCategory.name || '',
        type: selectedCategory.type || CategoryType.Expense,
        icon: selectedCategory.icon || iconOptions[0].options[0].value,
        description: selectedCategory.description || '',
        parentId: selectedCategory.parentId || null,
        isTypeDisabled: selectedCategory.parentId ? true : false,
      });
    }
  }, [selectedCategory, form]);

  const handleChangeParentCategory = (value: string | null, field: any) => {
    if (value && value !== 'null') {
      const parentCategory = categories.data?.find((category) => category.id === value);
      if (parentCategory?.type) {
        form.setValue('type', parentCategory.type);
        form.setValue('isTypeDisabled', true);
      }
    } else {
      form.setValue('isTypeDisabled', false);
    }
    field.onChange(value === 'null' ? null : value);
  };

  const onSubmit = async (data: UpdateCategoryDefaultValues) => {
    if (!selectedCategory?.id) return;

    try {
      // * Create updated category object
      const updatedCategory: Category = {
        ...selectedCategory,
        name: data.name,
        type: data.type,
        icon: data.icon,
        description: data.description ?? undefined,
        parentId: data.parentId,
      };

      // * Dispatch update action
      const response = await dispatch(updateCategory(updatedCategory)).unwrap();
      if (response) {
        dispatch(fetchCategories());
        dispatch(setSelectedCategory(null));
      }

      dispatch(setUpdateDialogOpen(false));
      toast.success('Category updated successfully!');
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory?.id) return;

    try {
      // Check if category has subcategories
      if (isParentDisabled) {
        toast.error('Please delete all subcategories first before deleting this category.');
        return;
      }

      dispatch(setDeleteConfirmOpen(true));
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  // * INITIALIZE VARIABLES *
  // * 1. If parent category is selected, disable the category type field
  const isTypeDisabled = form.watch('isTypeDisabled');
  // * 2. When parent already has children, disable the parent category field
  const isParentDisabled =
    selectedCategory?.subCategories?.length && selectedCategory.subCategories.length > 0
      ? true
      : false;

  // * 3. Filter out the current category from parent options to prevent circular references
  const parentOptions =
    categories.data?.filter(
      (category) => category.id !== selectedCategory?.id && !category.parentId,
    ) || [];

  return (
    <Dialog open={updateDialogOpen} onOpenChange={(open) => dispatch(setUpdateDialogOpen(open))}>
      <DialogContent>
        <DialogTitle>Edit Category: {selectedCategory?.name}</DialogTitle>
        <DialogDescription>Update the category details below.</DialogDescription>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Category Name */}
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

            {/* Icon Selector */}
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

            {/* Category Type */}
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

            {/* Parent Category */}
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
                        {parentOptions.map((category) => (
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

            {/* Description */}
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

            <DialogFooter className="flex-row justify-between md:justify-between">
              <div>
                <Button
                  variant="ghost"
                  type="button"
                  onClick={handleDelete}
                  disabled={categories.isLoading}
                  className="text-red-500 hover:text-red-700 hover:bg-red-100"
                >
                  <Icons.trash className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => dispatch(setUpdateDialogOpen(false))}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={!form.formState.isValid || categories.isLoading}>
                  {categories.isLoading && <Icons.spinner className="animate-spin mr-2" />}
                  Submit
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateDialog;
