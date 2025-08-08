'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ConfirmExitDialog from '../../../../components/common/organisms/ConfirmExitDialog';
import { useFaqUpsert } from '../../hooks/useFaqUpsert';
import FaqCategoryCreationDialog, {
  FaqCategoryFormValues,
} from '../organisms/FaqCategoryCreationDialog';
import FaqForm, { FaqFormValues } from '../organisms/FaqForm';

const CreateFaqPage = () => {
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

  const handleSubmit = async (values: FaqFormValues) => {
    const res = await submit(values);
    if (res) {
      setHasChanges(false);
      router.push(`/helps-center/faqs/details/${res}`);
    }
  };

  const handleOpenCreateCategoryDialog = () => setIsCategoryDialogOpen(true);
  const handleCategoryCreated = (newCategory: FaqCategoryFormValues) => {
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
          <h1 className="text-2xl font-bold text-gray-900">Create FAQ</h1>
        </div>

        <FaqForm
          defaultValues={defaultValues}
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={() => {
            if (hasChanges) {
              setPendingExit(() => () => router.push('/helps-center/faqs'));
              setOpenConfirmExitDialog(true);
            } else {
              router.push('/helps-center/faqs');
            }
          }}
          isSubmitting={isSubmitting}
          onOpenCreateCategoryDialog={handleOpenCreateCategoryDialog}
          onDirtyChange={handleDirtyChange}
        />
      </div>

      <FaqCategoryCreationDialog
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
          (pendingExit || (() => router.push('/helps-center/faqs')))();
        }}
        onCancelExit={() => setOpenConfirmExitDialog(false)}
      />
    </main>
  );
};

export default CreateFaqPage;
