import { Icons } from '@/components/Icon';
import { notFound, useParams, useRouter } from 'next/navigation';
import React from 'react';
import { useFaqDetail } from '../../hooks/useFaqDetail';
import { ConfirmDeleteDialog, FaqContent, FaqHeader, FaqRelatedArticles } from '../molecules';
import WarningDialog from '../molecules/WarningDialog';
import { FaqCommentsSection, FeedbackSection } from '../organisms';

const FaqDetailPage: React.FC = () => {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const {
    faq,
    error,
    isLoading,
    session,
    isAdminOrCs,
    showDeleteFaqDialog,
    setShowDeleteFaqDialog,
    openWarningDialog,
    setOpenWarningDialog,
    isDeletingFaq,
    handleEdit,
    handleDelete,
    handleDeleteFaq,
  } = useFaqDetail(id);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || !faq) {
    return notFound();
  }

  return (
    <section className="max-w-4xl mx-auto px-4 py-10 text-gray-800">
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

      <WarningDialog
        open={openWarningDialog}
        onClose={() => setOpenWarningDialog(false)}
        onSubmit={() => {
          setOpenWarningDialog(false);
          router.push('/login');
        }}
        title="Login Required"
        description="You need to login to do this action"
        icon={<Icons.warning className="h-5 w-5" />}
      />
    </section>
  );
};

export default FaqDetailPage;
