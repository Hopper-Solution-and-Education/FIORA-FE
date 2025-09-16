import { Skeleton } from '@/components/ui/skeleton';
import { notFound, useParams } from 'next/navigation';
import React from 'react';
import {
  ConfirmDeleteDialog,
  FaqContent,
  FaqHeader,
  LoginDialog,
} from '../../../helps-center/presentation/molecules';
import { useNewsDetail } from '../../hooks/useNewsDetail';
import { useUserSession } from '../../hooks/useUserSession';
import FeedbackSection from '../organisms/FeedbackSection';
import NewsCommentsSection from '../organisms/NewsCommentsSection';

const NewsDetailPage: React.FC = () => {
  const { id } = useParams() as { id: string };
  const {
    news,
    error,
    isLoading,
    showDeleteNewsDialog: showDeleteFaqDialog,
    setShowDeleteNewsDialog: setShowDeleteFaqDialog,
    openWarningDialog,
    setOpenWarningDialog,
    isDeletingNews: isDeletingFaq,
    handleEdit,
    handleDelete,
    handleDeleteNews: handleDeleteFaq,
  } = useNewsDetail(id);

  const { session, isAdmin } = useUserSession();

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="w-full h-96" />
      </div>
    );
  }

  if (error || !news) {
    return notFound();
  }

  return (
    <section className="container mx-auto px-6 space-y-6">
      {/* Header Section */}
      <FaqHeader
        data={news}
        canEdit={isAdmin}
        onEdit={isAdmin ? handleEdit : undefined}
        onDelete={isAdmin ? handleDelete : undefined}
      />
      {/* Content Section */}
      <FaqContent data={news} />
      <hr className="my-10 w-1/2 mx-auto" />
      {/* Feedback Section */}
      <FeedbackSection
        newsId={id}
        setOpenWarningDialog={setOpenWarningDialog}
        session={session ?? null}
      />
      {/* Comments Section */}
      <NewsCommentsSection
        newsId={id}
        setOpenWarningDialog={setOpenWarningDialog}
        session={session ?? null}
      />

      {/* FAQ Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={showDeleteFaqDialog}
        onClose={() => setShowDeleteFaqDialog(false)}
        onDelete={handleDeleteFaq}
        description={`Are you sure you want to delete this item? This action cannot be undone.`}
        isDeleting={isDeletingFaq}
      />

      <LoginDialog
        open={openWarningDialog}
        onClose={() => setOpenWarningDialog(false)}
        callbackUrl={id}
      />
    </section>
  );
};

export default NewsDetailPage;
