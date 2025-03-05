import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface DeleteDialogProps {
  deleteConfirmOpen: boolean;
  setDeleteConfirmOpen: (open: boolean) => void;
  handleDeleteCategory: () => void;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  deleteConfirmOpen,
  setDeleteConfirmOpen,
  handleDeleteCategory,
}) => {
  return (
    <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete this category?</p>
        <DialogFooter>
          <Button onClick={() => setDeleteConfirmOpen(false)}>No</Button>
          <Button variant="destructive" onClick={handleDeleteCategory}>
            Yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
