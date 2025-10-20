'use client';

import { InputField, SelectField } from '@/components/common/forms';
import DefaultSubmitButton from '@/components/common/molecules/DefaultSubmitButton';
import { Skeleton } from '@/components/ui/skeleton';
import { notFound, useParams, useRouter } from 'next/navigation';
import React from 'react';
import { PostType } from '../../domain/entities/models/faqs';
import { useFaqEdit } from '../../hooks';
import { FormField } from '../atoms';
import { ContentEditor } from '../molecules';

const EditTermsAndConditionsPage: React.FC = () => {
  const { id } = useParams() as { id: string };

  const router = useRouter();

  const {
    // Data
    faqData,
    formData,
    errors,

    // Loading states
    isLoading,
    isUpdating,
    isFormDisabled,

    // Handlers
    handleFieldChange,
    handleSubmit,

    error,
  } = useFaqEdit({ faqId: id });

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
      <div className="space-y-8">
        {/* Page Header */}
        <div className="border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-900">Edit Terms and Conditions</h1>
        </div>

        {/* Form Content */}
        <div>
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              key="title"
              name="title"
              label="Title"
              placeholder="Enter Terms and Conditions title"
              value={formData.title}
              onChange={(value) => handleFieldChange('title', value)}
              required
              error={errors.title as any}
              disabled={isFormDisabled}
            />

            <SelectField
              options={[{ label: 'Terms and Conditions', value: PostType.TNC }]}
              key="categoryId"
              name="categoryId"
              label="Category"
              value={PostType.TNC}
              disabled={true}
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
            onSubmit={() => handleSubmit(() => router.push(`/helps-center/terms-and-conditions`))}
            onBack={() => router.push(`/helps-center/terms-and-conditions`)}
          />
        </div>
      </div>
    </main>
  );
};

export default EditTermsAndConditionsPage;
