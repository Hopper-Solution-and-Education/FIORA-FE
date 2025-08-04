'use client';

import { InputField, SelectField } from '@/components/common/forms';
import DefaultSubmitButton from '@/components/common/molecules/DefaultSubmitButton';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';
import {
  useCreateFaqCategoryMutation,
  useCreateFaqMutation,
  useGetFaqCategoriesQuery,
} from '../../store/api/faqsApi';
import { FormField } from '../atoms';
import { ContentEditor } from '../molecules';
import FaqCategoryCreationDialog, {
  FaqCategoryFormValues,
} from '../organisms/FaqCategoryCreationDialog';

const initialFormData = {
  title: '',
  description: '',
  content: 'Content ',
  categoryId: '',
};

type FormData = typeof initialFormData;
type FormErrors = Partial<Record<keyof FormData, string>>;

const CreateFaqPage: React.FC = () => {
  const router = useRouter();
  const { data: categories = [], isLoading: isCategoriesLoading } = useGetFaqCategoriesQuery();
  const [createCategory, { isLoading: isCreatingCategory }] = useCreateFaqCategoryMutation();
  const [createFaq, { isLoading: isCreatingFaq }] = useCreateFaqMutation();

  const [formData, setFormData] = React.useState<FormData>(initialFormData);
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = React.useState(false);
  const [hasChanges, setHasChanges] = React.useState(false);

  // Handlers
  const handleFieldChange = (field: keyof FormData, value: string) => {
    if (field === 'content' && !value) return;
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateCategory = async (
    data: { name: string; description: string },
    onSuccess: () => void,
  ) => {
    try {
      await createCategory(data).unwrap();
      toast.success('Category created successfully');
      onSuccess();
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Failed to create category. Please try again.');
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please fix the form errors before submitting');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await createFaq({
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        content: formData.content.trim(),
        categoryId: formData.categoryId,
      }).unwrap();
      if (!res?.id) throw new Error('Failed to create FAQ');
      toast.success('FAQ Created Successfully');
      setHasChanges(false);
      setTimeout(() => {
        router.push(`/faqs/details/${res.id}`);
      }, 1500);
    } catch (error) {
      console.error('Error creating FAQ:', error);
      toast.error('Failed to create FAQ. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      const confirmCancel = window.confirm(
        'You have unsaved changes. Are you sure you want to cancel?',
      );
      if (!confirmCancel) return;
    }
    router.back();
  };

  const handleOpenCreateCategoryDialog = () => setIsCategoryDialogOpen(true);
  const handleCategoryCreated = (newCategory: FaqCategoryFormValues) => {
    handleCreateCategory(
      {
        name: newCategory.name,
        description: newCategory.description || '',
      },
      () => setIsCategoryDialogOpen(false),
    );
  };

  const isLoading = isCategoriesLoading || isSubmitting || isCreatingFaq;
  const isFormDisabled = isLoading;

  if (isLoading) {
    return (
      <main className="p-6 pt-24">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-10 bg-gray-300 rounded"></div>
              <div className="h-10 bg-gray-300 rounded"></div>
            </div>
            <div className="h-20 bg-gray-300 rounded"></div>
            <div className="h-96 bg-gray-300 rounded"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="px-6">
      <div className=" mx-auto space-y-8">
        {/* Page Header */}
        <div className="border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-900">Create FAQ</h1>
        </div>
        {/* Form Content */}
        <div className="space-y-8">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              key="title"
              name="title"
              label="Title"
              value={formData.title}
              onChange={(value) => handleFieldChange('title', value)}
              required
              error={errors.title as any}
              disabled={isFormDisabled}
            />
            <SelectField
              options={categories.map((item) => ({ label: item.name, value: item.id }))}
              key="categoryId"
              name="categoryId"
              label="Category"
              value={formData.categoryId}
              onChange={(value) => handleFieldChange('categoryId', value)}
              disabled={isFormDisabled}
              onCustomAction={handleOpenCreateCategoryDialog}
              customActionLabel="Add New"
              required
            />
          </div>
          {/* Description */}
          <FormField
            id="description"
            label="Description"
            type="textarea"
            value={formData.description}
            onChange={(value) => handleFieldChange('description', value)}
            error={errors.description}
            disabled={isFormDisabled}
          />
          {/* Content Editor */}
          <ContentEditor
            value={formData.content}
            onChange={(value) => handleFieldChange('content', value)}
            error={errors.content}
            disabled={isFormDisabled}
            showPreview={true}
          />

          {/* Form Actions */}
          <DefaultSubmitButton
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onBack={handleCancel}
          />
        </div>
      </div>
      {/* Category Creation Dialog */}
      <FaqCategoryCreationDialog
        open={isCategoryDialogOpen}
        onOpenChange={setIsCategoryDialogOpen}
        onCategoryCreated={handleCategoryCreated}
        isSubmitting={isCreatingCategory}
      />
    </main>
  );
};

export default CreateFaqPage;
