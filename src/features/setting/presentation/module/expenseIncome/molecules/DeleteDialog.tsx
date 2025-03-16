import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  setDeleteConfirmOpen,
  setSelectedCategory,
  setUpdateDialogOpen,
} from '@/features/setting/presentation/settingSlices/expenseIncomeSlides';
import {
  deleteCategory,
  fetchCategories,
} from '@/features/setting/presentation/settingSlices/expenseIncomeSlides/actions';
import { toast } from 'sonner';

const DeleteDialog: React.FC = () => {
  const dispatch = useAppDispatch();
  const { categories, selectedCategory, deleteConfirmOpen } = useAppSelector(
    (state) => state.expenseIncome,
  );

  const handleDeleteCategory = async () => {
    if (selectedCategory) {
      const response = await dispatch(deleteCategory(selectedCategory.id)).unwrap();
      if (response) {
        toast.success('Category deleted successfully');
        dispatch(setDeleteConfirmOpen(false));
        dispatch(setUpdateDialogOpen(false));
        dispatch(setSelectedCategory(null));
        dispatch(fetchCategories());
      }
    }
  };

  return (
    <Dialog open={deleteConfirmOpen} onOpenChange={(open) => dispatch(setDeleteConfirmOpen(open))}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete {selectedCategory?.name} category?</p>
        <DialogFooter>
          <Button onClick={() => dispatch(setDeleteConfirmOpen(false))}>No</Button>
          <Button
            variant="destructive"
            onClick={handleDeleteCategory}
            disabled={!selectedCategory || categories.isLoading}
          >
            Yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
