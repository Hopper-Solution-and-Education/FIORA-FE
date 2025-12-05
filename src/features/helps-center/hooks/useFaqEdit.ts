import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { UpdateFaqRequest } from '../domain/entities/models/faqs';
import {
  useCreateFaqCategoryMutation,
  useGetFaqCategoriesQuery,
  useGetFaqDetailQuery,
  useUpdateFaqMutation,
} from '../store/api/helpsCenterApi';

interface FormData {
  title: string;
  description: string;
  content: string;
  categoryId: string;
}

interface FormErrors {
  title?: string;
  description?: string;
  categoryId?: string;
  content?: string;
}

interface UseFaqEditProps {
  faqId: string;
}

export const useFaqEdit = ({ faqId }: UseFaqEditProps) => {
  const router = useRouter();

  // RTK Query hooks
  const {
    data: faqData,
    isLoading: isFaqLoading,
    error: faqError,
  } = useGetFaqDetailQuery({ id: faqId, trackView: false });

  const { data: categories = [], isLoading: isCategoriesLoading } = useGetFaqCategoriesQuery();

  const [updateFaq, { isLoading: isUpdating }] = useUpdateFaqMutation();

  const [createCategory, { isLoading: isCreatingCategory }] = useCreateFaqCategoryMutation();

  // Form state
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    content: '',
    categoryId: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize form data when FAQ data loads
  useEffect(() => {
    if (faqData) {
      const initialData = {
        title: faqData.title,
        description: faqData.description || '',
        content: faqData?.content || 'Input your content here',
        categoryId: faqData.categoryId || '',
      };
      setFormData(initialData);
      setHasChanges(false);
    }
  }, [faqData]);

  // Form field handlers
  const handleFieldChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setHasChanges(true);

    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  // Validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

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

  // Submit handler
  const handleSubmit = async (callback: () => void) => {
    if (!validateForm()) {
      toast.error('Please fix the form errors before submitting');
      return;
    }

    try {
      const updateData: UpdateFaqRequest = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        content: formData.content.trim(),
        categoryId: formData.categoryId,
      };

      await updateFaq({ faqId, updateData }).unwrap();

      toast.success('Updated Successfully');

      setHasChanges(false);

      callback();
    } catch (error) {
      console.error('Error updating FAQ:', error);
      toast.error('Failed to update FAQ. Please try again.');
    }
  };

  // Cancel handler
  const handleCancel = (faqId: string) => {
    if (hasChanges) {
      const confirmCancel = window.confirm(
        'You have unsaved changes. Are you sure you want to cancel?',
      );
      if (!confirmCancel) return;
    }

    router.push(`/faqs/details/${faqId}`);
  };

  // Loading states
  const isLoading = isFaqLoading || isCategoriesLoading;
  const isFormDisabled = isLoading || isUpdating;

  return {
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

    // Form state
    hasChanges,

    // Handlers
    handleFieldChange,
    handleSubmit,
    handleCancel,
    handleCreateCategory,

    // Utils
    validateForm,

    // Error state
    error: faqError,
  };
};
