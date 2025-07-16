'use client';

import { InputField, SelectField } from '@/components/common/forms';
import SessionSidebar from '@/components/providers/SessionSidebar';
import { useParams } from 'next/navigation';
import React from 'react';
import { useFaqEdit } from '../../hooks';
import { FormField } from '../atoms';
import { ContentEditor, FormActions } from '../molecules';
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
      <SessionSidebar appLabel="Faq">
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
      </SessionSidebar>
    );
  }

  if (error || !faqData) {
    return (
      <SessionSidebar appLabel="Faq">
        <main className="p-6 pt-24">
          <div className="max-w-6xl mx-auto text-center">
            <div className="text-red-500">
              <h2 className="text-xl font-semibold mb-2">FAQ not found</h2>
              <p className="text-gray-600">The requested FAQ could not be loaded for editing.</p>
              <button
                data-test="edit-faq-page-go-back"
                onClick={handleCancel}
                className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </main>
      </SessionSidebar>
    );
  }

  return (
    <SessionSidebar appLabel="Faq">
      <main className="p-6 pt-24">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="border-b pb-4">
            <h1 className="text-2xl font-bold text-gray-900">Edit FAQ</h1>
          </div>

          {/* Form Content */}
          <div className="space-y-8">
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

            {/* Content Editor */}
            <ContentEditor
              value={formData.content}
              onChange={(value) => handleFieldChange('content', value)}
              error={errors.content}
              disabled={isFormDisabled}
              showPreview={true}
            />

            {/* Form Actions */}
            <FormActions
              onCancel={handleCancel}
              onSubmit={handleSubmit}
              isSubmitting={isUpdating}
              disabled={isFormDisabled}
              submitText="Update FAQ"
              cancelText="Cancel"
              showIcons={true}
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
    </SessionSidebar>
  );
};

export default EditFaqPage;
