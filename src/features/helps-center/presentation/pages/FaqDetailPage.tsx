import { Skeleton } from '@/components/ui/skeleton';
import { notFound, useParams } from 'next/navigation';
import React from 'react';
import { useFaqDetail } from '../../hooks/useFaqDetail';
import { useUserSession } from '../../hooks/useUserSession';
import {
  ConfirmDeleteDialog,
  FaqContent,
  FaqHeader,
  FaqRelatedArticles,
  LoginDialog,
} from '../molecules';
import { FaqCommentsSection, FeedbackSection } from '../organisms';

const FaqDetailPage: React.FC = () => {
  const { id } = useParams() as { id: string };
  const {
    faq,
    error,
    isLoading,
    showDeleteFaqDialog,
    setShowDeleteFaqDialog,
    openWarningDialog,
    setOpenWarningDialog,
    isDeletingFaq,
    handleEdit,
    handleDelete,
    handleDeleteFaq,
  } = useFaqDetail(id);

  const { session, isAdminOrCs } = useUserSession();

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="w-full h-96" />
      </div>
    );
  }

  if (error || !faq) {
    return notFound();
  }

  return (
    <section className="mx-auto px-8 space-y-6 ">
      {/* Header Section */}
      <FaqHeader
        data={faq}
        canEdit={isAdminOrCs}
        onEdit={isAdminOrCs ? handleEdit : undefined}
        onDelete={isAdminOrCs ? handleDelete : undefined}
      />
      {/* Content Section */}
      <FaqContent data={faq} />
      <hr className="my-10 w-1/2 mx-auto" />
      {/* Related Articles */}
      <FaqRelatedArticles includedArticles={faq.relatedArticles} />
      <hr className="my-10 w-1/2 mx-auto" />
      {/* Feedback Section */}
      <FeedbackSection
        faqId={id}
        setOpenWarningDialog={setOpenWarningDialog}
        session={session ?? null}
      />
      {/* Comments Section */}
      <FaqCommentsSection
        faqId={id}
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

export default FaqDetailPage;
