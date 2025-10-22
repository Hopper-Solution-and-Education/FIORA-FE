'use client';

import CommonEditor from '@/components/common/atoms/CommonEditor';
import UploadImageField from '@/components/common/forms/upload/UploadImageField';
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
import { yupResolver } from '@hookform/resolvers/yup';
import { Plus } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { AnyObject, ObjectSchema } from 'yup';
import * as yup from 'yup';

export type NewsFormValues = {
  title: string;
  description?: string;
  content: string;
  type: string;
  categoryId: string;
  userId?: string;
  thumbnail?: string;
};

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
    title: yup
      .string()
      .trim()
      .required('Title is required')
      .max(255, 'Title cannot exceed 255 characters.'),
    description: yup.string().optional().max(255, 'Description cannot exceed 255 characters.'),
    content: yup.string().trim().required('Content is required'),
    categoryId: yup.string().trim().required('Category is required'),
    thumbnail: yup.string().optional(),
    userId: yup.string().trim().optional(),
    type: yup.string().trim().required('Post type is required'),
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

  const handleSubmit = async (values: NewsFormValues) => {
    const content = values.content
      // Xóa các thẻ line break
      .replace(/<br\s*\/?>/gi, '')
      // Xóa các comment HTML
      .replace(/<!--[\s\S]*?-->/g, '')
      // Xóa các entity đặc biệt như &nbsp; &ZeroWidthSpace;
      .replace(/&nbsp;|&#160;|&#8203;/gi, '')
      // Xóa các thẻ HTML
      .replace(/<[^>]*>/g, '')
      // Xóa khoảng trắng, tab, xuống dòng
      .replace(/\s+/g, '')
      .trim();
    if (content === '') {
      toast.error('Content is required');
      return;
    }
    onSubmit(values);
  };

  return (
    <FormProvider {...form}>
      <div className="space-y-8" aria-label="News form">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    rows={7}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Thumbnail Upload */}
          <Controller
            name="thumbnail"
            control={control}
            render={({ field }) => (
              <FormItem>
                <UploadImageField
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  label="Thumbnail"
                  placeholder="Choose thumbnail"
                  previewShape="square"
                  size="medium"
                  disabled={isSubmitting}
                  containerClassName="max-w-md"
                  canChangeShape={false}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Content Editor */}
        <FormField
          control={control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Content <span className="text-red-500">*</span>
              </FormLabel>
              <CommonEditor
                content={field.value ?? ''}
                onChangeContent={field.onChange}
                disabled={isSubmitting}
                output="html"
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
      </div>
    </FormProvider>
  );
};

export default NewsForm;
