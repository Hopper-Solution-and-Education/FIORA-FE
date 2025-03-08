'use client';
import IconSelect from '@/components/common/IconSelect';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import CategoryTable from '@/features/setting/presentation/module/expenseIncome/organisms/CategoryTable';
import {
  setDeleteConfirmOpen,
  setSelectedCategory,
} from '@/features/setting/presentation/settingSlices/expenseIncomeSlides';
import { Category } from '@/features/setting/presentation/settingSlices/expenseIncomeSlides/types';
import { useAppDispatch, useAppSelector } from '@/store';
import { useEffect, useState } from 'react';

interface UpdateDialogProps {
  isDetailDialogOpen: boolean;
  setDetailDialogOpen: (open: boolean) => void;
}

const UpdateDialog: React.FC<UpdateDialogProps> = ({ isDetailDialogOpen, setDetailDialogOpen }) => {
  const dispatch = useAppDispatch();
  const { selectedCategory } = useAppSelector((state) => state.expenseIncome);

  // Local state for editable fields
  const [categoryName, setCategoryName] = useState(selectedCategory?.name || '');
  const [selectedIcon, setSelectedIcon] = useState(selectedCategory?.icon || 'trash');

  // Sync local state with selectedCategory changes
  useEffect(() => {
    setCategoryName(selectedCategory?.name || '');
    setSelectedIcon(selectedCategory?.icon || 'trash');
  }, [selectedCategory]);

  // Handle update API call
  const handleUpdate = async () => {
    if (!selectedCategory?.id) return;

    try {
      //   const response = await fetch('/api/categories/expense-income', {
      //     method: 'PUT',
      //     credentials: 'include',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({
      //       id: selectedCategory.id,
      //       name: categoryName,
      //       type: selectedCategory.type,
      //       icon: selectedIcon, // Cập nhật icon cho main category
      //       description: selectedCategory.description,
      //       parentId: selectedCategory.parentId,
      //       // Note: subCategories không được gửi trực tiếp, xử lý riêng nếu cần
      //     }),
      //   });

      //   const data = await response.json();
      //   if (!response.ok) {
      //     throw new Error(data.message || 'Failed to update category');
      //   }

      // Cập nhật Redux store với category đã chỉnh sửa
      const updatedCategory: Category = {
        ...selectedCategory,
        name: categoryName,
        icon: selectedIcon,
      };
      dispatch(setSelectedCategory(updatedCategory));
      setDetailDialogOpen(false); // Đóng dialog khi thành công
    } catch (error: any) {
      console.error('Error updating category:', error.message);
      // Xử lý lỗi (ví dụ: hiển thị toast)
    }
  };

  if (!selectedCategory) {
    return null;
  }

  return (
    <Dialog open={isDetailDialogOpen} onOpenChange={setDetailDialogOpen}>
      <DialogContent>
        <DialogTitle>Edit Category: {selectedCategory.name}</DialogTitle>
        <DialogDescription>
          Update the category name, icon, and its subcategories below.
        </DialogDescription>

        {/* Category Name and Icon Input */}
        <div className="mb-4">
          <label htmlFor="categoryName" className="block text-sm font-medium">
            Main Category
          </label>
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="categoryName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter category name"
              className="mt-1"
            />
            <IconSelect selectedIcon={selectedIcon} onIconChange={setSelectedIcon} />
          </div>
        </div>

        {/* Subcategories Table */}
        <CategoryTable
          setSelectedCategory={(cat) => dispatch(setSelectedCategory(cat))}
          setDeleteConfirmOpen={(open) => dispatch(setDeleteConfirmOpen(open))}
        />

        <DialogFooter>
          <Button variant="destructive" onClick={() => setDetailDialogOpen(false)}>
            Close
          </Button>
          <Button onClick={handleUpdate}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateDialog;
