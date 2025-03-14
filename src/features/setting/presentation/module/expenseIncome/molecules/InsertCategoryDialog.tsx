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
                  <FormLabel>Category Name</FormLabel>
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
                  <FormLabel>Icon</FormLabel>
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
                  <FormLabel>Category Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Parent Category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value={null as any}>None</SelectItem>
                        <SelectItem value={CategoryType.Expense}>Expense</SelectItem>
                        <SelectItem value={CategoryType.Income}>Income</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tax Rate */}
            <FormField
              control={form.control}
              name="tax_rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax Rate (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Tax Rate"
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(e.target.value ? Number(e.target.value) : null)
                      }
                    />
                  </FormControl>
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
