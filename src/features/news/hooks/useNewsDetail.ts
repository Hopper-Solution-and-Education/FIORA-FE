import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { NEWS_LIST_CONSTANTS } from '../constants';
import { useDeleteNewsMutation, useGetNewsDetailQuery } from '../store/api/newsApi';

export const useNewsDetail = (id: string) => {
  const router = useRouter();

  // FAQ detail
  const {
    data: news,
    error,
    isLoading,
  } = useGetNewsDetailQuery({
    id,
    trackView: true,
    include: [NEWS_LIST_CONSTANTS.GET_NEWS_DETAIL_INCLUDE.related],
  });

  // Mutations
  const [deleteNews, { isLoading: isDeletingNews }] = useDeleteNewsMutation();

  // Local state for dialogs
  const [showDeleteNewsDialog, setShowDeleteNewsDialog] = useState(false);
  const [openWarningDialog, setOpenWarningDialog] = useState(false);

  // Handlers
  const handleDeleteNews = async () => {
    if (!news?.id) return;
    try {
      await deleteNews(news.id).unwrap();
      setShowDeleteNewsDialog(false);
      toast.success(`"${news.title}" has been deleted successfully`);
      setTimeout(() => {
        router.push('/news');
      }, 1000);
    } catch (error) {
      console.error('Error deleting News:', error);
      toast.error('Failed to delete News. Please try again.');
    }
  };

  const handleEdit = () => {
    router.push(`/news/details/${id}/edit`);
  };

  const handleDelete = () => {
    setShowDeleteNewsDialog(true);
  };

  return {
    // Data
    news,
    error,
    isLoading,
    showDeleteNewsDialog,
    setShowDeleteNewsDialog,
    openWarningDialog,
    setOpenWarningDialog,
    isDeletingNews,
    // Handlers
    handleEdit,
    handleDelete,
    handleDeleteNews,
  };
};
