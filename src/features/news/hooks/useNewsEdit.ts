import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { NewsUpdateRequest } from '../api/types/newsDTO';
import { CreatePostCategoryRequest } from '../api/types/postCategoryDTO';
import {
  useCreateNewsCategoryMutation,
  useGetNewsCategoriesQuery,
  useGetNewsDetailQuery,
  useUpdateNewsMutation,
} from '../store/api/newsApi';
import { useUserSession } from './useUserSession';

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
  userId?: string;
}

interface UseFaqEditProps {
  newsId: string;
}

export const useNewsEdit = ({ newsId }: UseFaqEditProps) => {
  const router = useRouter();

  // RTK Query hooks
  const {
    data: newsData,
    isLoading: isFaqLoading,
    error: faqError,
  } = useGetNewsDetailQuery({ id: newsId, trackView: false });

  const { data: categories = [], isLoading: isCategoriesLoading } = useGetNewsCategoriesQuery();

  const [updateNews, { isLoading: isUpdating }] = useUpdateNewsMutation();

  const [createCategory, { isLoading: isCreatingCategory }] = useCreateNewsCategoryMutation();

  const { session } = useUserSession();

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
    if (newsData) {
      const initialData = {
        title: newsData.title,
        description: newsData.description || '',
        content: newsData.content,
        categoryId: newsData.categoryId || '',
      };
      setFormData(initialData);
      setHasChanges(false);
    }
  }, [newsData]);

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

    if (typeof session?.user === 'undefined') {
      newErrors.userId = 'User id is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateCategory = async (data: CreatePostCategoryRequest, onSuccess: () => void) => {
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
      const updateData: NewsUpdateRequest = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        content: formData.content.trim(),
        categoryId: formData.categoryId,
        type: 'NEWS',
        userId: session!.user.id,
      };

      await updateNews({ newsId, updateData }).unwrap();

      toast.success('Updated Successfully');

      setHasChanges(false);

      callback();
    } catch (error) {
      console.error('Error updating News:', error);
      toast.error('Failed to update News. Please try again.');
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

    router.push(`/news/details/${faqId}`);
  };

  // Loading states
  const isLoading = isFaqLoading || isCategoriesLoading;
  const isFormDisabled = isLoading || isUpdating;

  return {
    // Data
    faqData: newsData,
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
