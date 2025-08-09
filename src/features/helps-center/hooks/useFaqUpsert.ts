import { useMemo } from 'react';
import { toast } from 'sonner';
import type { FaqFormValues } from '../presentation/organisms/FaqForm';
import {
  useCreateFaqCategoryMutation,
  useCreateFaqMutation,
  useGetFaqCategoriesQuery,
  useGetFaqDetailQuery,
  useUpdateFaqMutation,
} from '../store/api/helpsCenterApi';

type UseFaqUpsertOptions = {
  faqId?: string;
};

export const useFaqUpsert = ({ faqId }: UseFaqUpsertOptions = {}) => {
  // Categories
  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useGetFaqCategoriesQuery();

  // Create or Edit data
  const {
    data: faqData,
    isLoading: isFaqLoading,
    error: faqError,
  } = useGetFaqDetailQuery({ id: faqId as string, trackView: false }, { skip: !faqId });

  const [createFaq, { isLoading: isCreating }] = useCreateFaqMutation();
  const [updateFaq, { isLoading: isUpdating }] = useUpdateFaqMutation();
  const [createCategory, { isLoading: isCreatingCategory }] = useCreateFaqCategoryMutation();

  const defaultValues: FaqFormValues = useMemo(() => {
    if (faqId && faqData) {
      return {
        title: faqData.title ?? '',
        description: faqData.description ?? '',
        content: faqData.content ?? '',
        categoryId: faqData.categoryId ?? '',
      };
    }
    return { title: '', description: '', content: ' ', categoryId: '' };
  }, [faqData, faqId]);

  const isLoading = (faqId ? isFaqLoading : false) || isCategoriesLoading;
  const isSubmitting = isCreating || isUpdating;
  const error = faqError || categoriesError;

  const submit = async (values: FaqFormValues): Promise<string | undefined> => {
    try {
      if (faqId) {
        await updateFaq({
          faqId,
          updateData: {
            title: values.title.trim(),
            description: values.description?.trim() || undefined,
            content: values.content.trim(),
            categoryId: values.categoryId,
          },
        }).unwrap();
        toast.success('Updated Successfully');
        return;
      }
      const res = await createFaq({
        title: values.title.trim(),
        description: values.description?.trim() || undefined,
        content: values.content.trim(),
        categoryId: values.categoryId,
      }).unwrap();
      toast.success('FAQ Created Successfully');
      return res.id;
    } catch (error: any) {
      console.error('Error creating faq:', error);
      if (error?.data?.message) {
        toast.error(error?.data?.message);
      } else {
        toast.error('Failed to create FAQ. Please try again.');
      }
    }
  };

  const handleCreateCategory = async (
    data: { name: string; description: string },
    onSuccess: () => void,
  ) => {
    try {
      await createCategory(data).unwrap();
      toast.success('Category created successfully');
      onSuccess();
    } catch (e) {
      console.error('Error creating category:', e);
      toast.error('Failed to create category. Please try again.');
    }
  };

  return {
    // data
    categories,
    defaultValues,
    error,

    // state
    isLoading,
    isSubmitting,
    isCreatingCategory,

    // actions
    submit,
    handleCreateCategory,
  };
};
