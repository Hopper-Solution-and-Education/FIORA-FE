'use client';

import { InputField, SelectField } from '@/components/common/forms';
import DefaultSubmitButton from '@/components/common/molecules/DefaultSubmitButton';
import { Skeleton } from '@/components/ui/skeleton';
import { notFound, useParams } from 'next/navigation';
import React from 'react';
import { useFaqEdit } from '../../hooks';
import { FormField } from '../atoms';
import { ContentEditor } from '../molecules';
import FaqCategoryCreationDialog, {
  FaqCategoryFormValues,
} from '../organisms/FaqCategoryCreationDialog';

const EditFaqPage: React.FC = () => {
  const { id } = useParams() as { id: string };

  const {
    // Data
    faqData,
    categories,
    formData,
    errors,

    // Loading states
    isLoading,
    isUpdating,
    isFormDisabled,
    isCreatingCategory,

    // Handlers
    handleFieldChange,
    handleSubmit,
    handleCancel,
    handleCreateCategory,
    // Error state
    error,
  } = useFaqEdit({ faqId: id });

  // Local state for dialog and categories
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = React.useState(false);

  // Open dialog handler
  const handleOpenCreateCategoryDialog = () => {
    setIsCategoryDialogOpen(true);
  };

  // Add new category handler
  const handleCategoryCreated = (newCategory: FaqCategoryFormValues) => {
    handleCreateCategory(
      {
        name: newCategory.name,
        description: newCategory.description || '',
      },
      () => {
        setIsCategoryDialogOpen(false);
      },
    );
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="w-full h-96" />
      </div>
    );
  }

  if (error || !faqData) {
    return notFound();
  }

  return (
    <main className="p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-900">Edit FAQ</h1>
        </div>

        {/* Form Content */}
        <div>
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* <FormField
                id="title"
                label="Title"
                value={formData.title}
                onChange={(value) => handleFieldChange('title', value)}
                placeholder="Enter FAQ title"
                required
                error={errors.title}
                disabled={isFormDisabled}
              /> */}
            <InputField
              key="title"
              name="title"
              label="Title"
              placeholder="Enter FAQ title"
              value={formData.title}
              onChange={(value) => handleFieldChange('title', value)}
              required
              error={errors.title as any}
              disabled={isFormDisabled}
            />

            {/* <CategorySelect
                id="categoryId"
                label="Category"
                value={formData.categoryId}
                onChange={(value) => handleFieldChange('categoryId', value)}
                categories={categories}
                placeholder="Select category"
                required
                error={errors.categoryId}
                disabled={isFormDisabled}
                loading={isLoading}
              /> */}
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
          <div className="mb-6">
            <FormField
              id="description"
              label="Description"
              type="textarea"
              value={formData.description}
              onChange={(value) => handleFieldChange('description', value)}
              placeholder="Brief description (optional)"
              error={errors.description}
              disabled={isFormDisabled}
            />
          </div>

          {/* Content Editor */}
          <ContentEditor
            value={formData.content}
            onChange={(value) => handleFieldChange('content', value)}
            error={errors.content}
            disabled={isFormDisabled}
            showPreview={true}
          />

          <DefaultSubmitButton
            isSubmitting={isUpdating}
            disabled={isFormDisabled}
            onSubmit={handleSubmit}
            onBack={() => handleCancel(id)}
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

export default EditFaqPage;
