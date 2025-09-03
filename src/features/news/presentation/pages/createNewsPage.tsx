'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useFaqUpsert } from '@/features/helps-center/hooks/useFaqUpsert';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ConfirmExitDialog from '../../../../components/common/organisms/ConfirmExitDialog';
import NewsCategoryCreationDialog, {
  NewsCategoryFormValues,
} from '../organisms/NewsCategoryCreationDialog';
import NewsForm, { NewsFormValues } from '../organisms/NewsForm';
const CreateNewsPage = () => {
  const router = useRouter();
  const {
    categories,
    defaultValues,
    isLoading,
    isSubmitting,
    isCreatingCategory,
    submit,
    handleCreateCategory,
  } = useFaqUpsert();

  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [openConfirmExitDialog, setOpenConfirmExitDialog] = useState(false);
  const [pendingExit, setPendingExit] = useState<(() => void) | null>(null);

  // Handlers
  const handleDirtyChange = (dirty: boolean) => setHasChanges(dirty);

  const handleSubmit = async (values: NewsFormValues) => {
    const res = await submit(values);
    if (res) {
      setHasChanges(false);
      router.push(`/news/details/${res}`);
    }
  };

  const handleOpenCreateCategoryDialog = () => setIsCategoryDialogOpen(true);
  const handleCategoryCreated = (newCategory: NewsCategoryFormValues) => {
    handleCreateCategory(
      {
        name: newCategory.name,
        description: newCategory.description || '',
      },
      () => setIsCategoryDialogOpen(false),
    );
  };

  // Warn on hard reload/tab close with native prompt
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!hasChanges) return;
      e.preventDefault();
      e.returnValue = '';
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
          <h1 className="text-2xl font-bold text-gray-900">Create News</h1>
        </div>

        <NewsForm
          defaultValues={defaultValues}
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={() => {
            if (hasChanges) {
              setPendingExit(() => () => router.push('/news'));
              setOpenConfirmExitDialog(true);
            } else {
              router.push('/news');
            }
          }}
          isSubmitting={isSubmitting}
          onOpenCreateCategoryDialog={handleOpenCreateCategoryDialog}
          onDirtyChange={handleDirtyChange}
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
