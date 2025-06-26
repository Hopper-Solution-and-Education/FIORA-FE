import { useGetFaqCategoriesQuery } from '../store/api/faqsApi';

export const useFaqCategories = () => {
  const { data: categories = [], isLoading, error, refetch } = useGetFaqCategoriesQuery();

  const errorMessage = error ? 'Failed to load categories' : null;

  return {
    categories,
    isLoading,
    error: errorMessage,
    refetch,
  };
};
