import { useMemo } from 'react';
import { toast } from 'sonner';
import { CreatePostCategoryRequest } from '../api/types/postCategoryDTO';
import { NewsFormValues } from '../presentation/organisms/NewsForm';
import {
  useCreateNewsCategoryMutation,
  useCreateNewsMutation,
  useGetNewsCategoriesQuery,
  useGetNewsDetailQuery,
  useUpdateNewsMutation,
} from '../store/api/newsApi';

type UseNewsUpsertOptions = {
  newsId?: string;
};

export const useNewsUpsert = ({ newsId }: UseNewsUpsertOptions = {}) => {
  // Categories
  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useGetNewsCategoriesQuery();

  // Create or Edit data
  const {
    data: newsData,
    isLoading: isNewsLoading,
    error: newsError,
  } = useGetNewsDetailQuery({ id: newsId as string, trackView: false }, { skip: !newsId });

  const [createNews, { isLoading: isCreating }] = useCreateNewsMutation();
  const [updateNews, { isLoading: isUpdating }] = useUpdateNewsMutation();
  const [createCategory, { isLoading: isCreatingCategory }] = useCreateNewsCategoryMutation();

  const defaultValues: NewsFormValues = useMemo(() => {
    if (newsId && newsData) {
      return {
        title: newsData.title ?? '',
        description: newsData.description ?? '',
        content: newsData.content ?? '',
        categoryId: newsData.categoryId ?? '',
        type: 'NEWS',
        userId: newsData.userId ?? '',
        thumbnail: newsData.thumbnail ?? '',
      };
    }
    return {
      title: '',
      description: '',
      content: ' ',
      categoryId: '',
      type: 'NEWS',
      userId: '',
      thumbnail: '',
    };
  }, [newsData, newsId]);

  const isLoading = (newsId ? isNewsLoading : false) || isCategoriesLoading;
  const isSubmitting = isCreating || isUpdating;
  const error = newsError || categoriesError;

  const submit = async (values: NewsFormValues): Promise<string | undefined> => {
    try {
      if (newsId) {
        console.log('values update news', values);

        await updateNews({
          newsId,
          updateData: {
            title: values.title.trim(),
            description: values.description?.trim() || undefined,
            content: values.content.trim(),
            categoryId: values.categoryId,
            type: values.type,
            userId: values.userId,
            thumbnail: values.thumbnail,
          },
        }).unwrap();
        toast.success('Updated Successfully');
        return;
      }
      const res = await createNews({
        title: values.title.trim(),
        description: values.description?.trim() || undefined,
        content: values.content.trim(),
        categoryId: values.categoryId,
        type: 'NEWS',
        userId: values.userId,
        thumbnail: values.thumbnail,
      }).unwrap();
      toast.success('News Created Successfully');
      return res.id;
    } catch (error: any) {
      console.error('Error creating news:', error);
      if (error?.data?.message) {
        toast.error(error?.data?.message);
      } else {
        toast.error('Failed to create news. Please try again.');
      }
    }
  };

  const handleCreateCategory = async (data: CreatePostCategoryRequest, onSuccess: () => void) => {
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
