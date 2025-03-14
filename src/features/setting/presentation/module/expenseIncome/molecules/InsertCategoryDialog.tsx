'use client';
import IconSelect from '@/components/common/IconSelect';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

import {
  defaultNewCategoryValues,
  NewCategoryDefaultValues,
  validateNewCategorySchema,
} from '@/features/setting/presentation/settingSlices/expenseIncomeSlides/utils/formSchema';
import { useAppSelector } from '@/store';
import { CategoryType } from '@prisma/client';
import React from 'react';

interface InsertCategoryDialogProps {
  title?: string;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  handleCreateCategory: (category: NewCategoryDefaultValues) => void;
}

const InsertCategoryDialog: React.FC<InsertCategoryDialogProps> = ({
  title,
  dialogOpen,
  setDialogOpen,
  handleCreateCategory,
}) => {
  const { categories } = useAppSelector((state) => state.expenseIncome);
  const form = useForm<NewCategoryDefaultValues>({
    resolver: yupResolver(validateNewCategorySchema),
    defaultValues: defaultNewCategoryValues,
  });

  const onSubmit = (data: NewCategoryDefaultValues) => {
    handleCreateCategory(data);
    setDialogOpen(false);
    toast.success('Category created successfully');
    form.reset();
  };

  const handleCloseDialog = (e: boolean) => {
    setDialogOpen(e);
    form.reset();
  };

  const handleChangeParentCategory = (value: string | null, field: any) => {
    if (value && value !== 'null') {
      const parentCategory = categories.data?.find((category) => category.id === value);
      if (parentCategory?.type) {
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
    <Dialog open={dialogOpen} onOpenChange={handleCloseDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title ? title : 'Create New Category'}</DialogTitle>
        </DialogHeader>

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
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Parent Category" />
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

            <DialogFooter>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InsertCategoryDialog;
