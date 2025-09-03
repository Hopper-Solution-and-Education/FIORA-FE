'use client';

import DefaultSubmitButton from '@/components/common/molecules/DefaultSubmitButton';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ContentEditor } from '@/features/helps-center/presentation/molecules';
import { FaqFormValues } from '@/features/helps-center/presentation/organisms/FaqForm';
import { yupResolver } from '@hookform/resolvers/yup';
import { Plus } from 'lucide-react';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { AnyObject, ObjectSchema } from 'yup';
import * as yup from 'yup';

export type NewsFormValues = FaqFormValues;

type CategoryOption = { id: string; name: string };

type NewsFormProps = {
  defaultValues: NewsFormValues;
  categories: CategoryOption[];
  onSubmit: (values: NewsFormValues) => Promise<void> | void;
  onCancel: () => void;
  isSubmitting?: boolean;
  onOpenCreateCategoryDialog?: () => void;
  onDirtyChange?: (isDirty: boolean) => void;
};

const schema: ObjectSchema<NewsFormValues, AnyObject> = yup
  .object({
    title: yup.string().trim().required('Title is required'),
    description: yup.string().optional(),
    content: yup.string().trim().required('Content is required'),
    categoryId: yup.string().trim().required('Category is required'),
  })
  .required();

const NewsForm = ({
  defaultValues,
  categories,
  onSubmit,
  onCancel,
  isSubmitting = false,
  onOpenCreateCategoryDialog,
  onDirtyChange,
}: NewsFormProps) => {
  const form = useForm<NewsFormValues>({
    resolver: yupResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  const {
    control,
    reset,
    formState: { isDirty, isValid },
  } = form;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  useEffect(() => {
    if (onDirtyChange) onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  const handleSubmit = (values: NewsFormValues) => {
    if (values.content === '<p></p>') {
      toast.error('Content is required');
      return;
    }
    onSubmit(values);
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(form.getValues());
        }}
        className="space-y-8"
        aria-label="FAQ form"
      >
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    id="title"
                    placeholder="Enter News title"
                    {...field}
                    value={field.value ?? ''}
                    aria-required
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category */}
          <FormField
            control={control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="categoryId">
                  Category <span className="text-red-500">*</span>
                </FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(val) => {
                    if (val === '__add_new__') {
                      if (onOpenCreateCategoryDialog) onOpenCreateCategoryDialog();
                      return;
                    }
                    field.onChange(val);
                  }}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger id="categoryId" aria-required>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id} aria-label={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                    {onOpenCreateCategoryDialog && (
                      <>
                        <SelectItem
                          value="__add_new__"
                          aria-label={'Add New'}
                          className="text-primary"
                        >
                          <div className="flex items-center gap-2 text-center">
                            <Plus size={16} />
                            Add New
                          </div>
                        </SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description */}
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="description">Description</FormLabel>
              <FormControl>
                <Textarea
                  id="description"
                  placeholder="Brief description (optional)"
                  {...field}
                  value={field.value ?? ''}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Content Editor */}
        <FormField
          control={control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Content <span className="text-red-500">*</span>
              </FormLabel>
              <ContentEditor
                value={field.value ?? ''}
                onChange={field.onChange}
                disabled={isSubmitting}
                showPreview
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Actions */}
        <DefaultSubmitButton
          isSubmitting={isSubmitting}
          disabled={!isValid || isSubmitting}
          onSubmit={() => {
            handleSubmit(form.getValues());
          }}
          onBack={onCancel}
        />
      </form>
    </FormProvider>
  );
};

export default NewsForm;
