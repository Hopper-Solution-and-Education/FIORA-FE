'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { uploadToFirebase } from '@/shared/lib';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ConfirmExitDialog from '../../../../components/common/organisms/ConfirmExitDialog';
import { useNewsUpsert } from '../../hooks/useNewsUpsert';
import { useUserSession } from '../../hooks/useUserSession';
import NewsCategoryCreationDialog, {
  NewsCategoryFormValues,
} from '../organisms/NewsCategoryCreationDialog';
import NewsForm, { NewsFormValues } from '../organisms/NewsForm';

const CreateNewsPage = () => {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const {
    categories,
    defaultValues,
    isLoading,
    isSubmitting,
    isCreatingCategory,
    submit,
    handleCreateCategory,
  } = useNewsUpsert();

  const { session } = useUserSession();

  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [openConfirmExitDialog, setOpenConfirmExitDialog] = useState(false);
  const [pendingExit, setPendingExit] = useState<(() => void) | null>(null);

  // Handlers
  const handleDirtyChange = (dirty: boolean) => setHasChanges(dirty);

  const handleSubmit = async (values: NewsFormValues) => {
    if (typeof session?.user === 'undefined') return;
    values.userId = session?.user.id;

    const convertToFile = async (url: string) => {
      const response = await fetch(url);
      const blob = await response.blob();
      const file = new File([blob], 'thumbnailCreation.jpg', { type: blob.type });
      return file;
    };

    if (values.thumbnail && values.thumbnail.startsWith('blob:')) {
      const file = await convertToFile(values.thumbnail);
      values.thumbnail = await uploadToFirebase({
        file,
        path: 'images/news/thumbnails',
        fileName: `news-${Date.now()}`,
      });
    }

    const res = await submit(values);
    if (res) {
      setHasChanges(false);

      // Small delay to ensure layout stability before navigation
      router.push(`/news/details/${res}`);
    }
  };

  const handleOpenCreateCategoryDialog = () => setIsCategoryDialogOpen(true);
  const handleCategoryCreated = (newCategory: NewsCategoryFormValues) => {
    if (typeof session?.user === 'undefined') return;
    handleCreateCategory(
      {
        name: newCategory.name,
        description: newCategory.description || '',
        type: 'NEWS',
        userId: session?.user.id,
      },
      () => setIsCategoryDialogOpen(false),
    );
  };

  // Warn on hard reload/tab close with native prompt
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!hasChanges) return;
      e.preventDefault();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  // Intercept F5 / Ctrl+R to show custom confirm dialog
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!hasChanges) return;
      const isReload = e.key === 'F5' || (e.key.toLowerCase() === 'r' && (e.ctrlKey || e.metaKey));
      if (!isReload) return;
      e.preventDefault();
      setPendingExit(() => () => window.location.reload());
      setOpenConfirmExitDialog(true);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasChanges]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="w-full h-96" />
      </div>
    );
  }

  return (
    <main className="px-8">
      <div className="mx-auto space-y-8">
        <div className="border-b pb-4">
          <h1 className="text-2xl font-bold text-foreground">Create News</h1>
        </div>

        <NewsForm
          defaultValues={defaultValues}
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={() => {
            if (hasChanges) {
              setPendingExit(() => () => router.push(`/news/details/${id}`));
              setOpenConfirmExitDialog(true);
            } else {
              router.push(`/news/details/${id}`);
            }
          }}
          isSubmitting={isSubmitting}
        />
      </div>

      <NewsCategoryCreationDialog
        open={isCategoryDialogOpen}
        onOpenChange={setIsCategoryDialogOpen}
        onCategoryCreated={handleCategoryCreated}
        isSubmitting={isCreatingCategory}
      />

      <ConfirmExitDialog
        open={openConfirmExitDialog}
        onOpenChange={setOpenConfirmExitDialog}
        onConfirmExit={() => {
          setOpenConfirmExitDialog(false);
          (pendingExit || (() => router.push('/news')))();
        }}
        onCancelExit={() => setOpenConfirmExitDialog(false)}
      />
    </main>
  );
};

export default CreateNewsPage;
