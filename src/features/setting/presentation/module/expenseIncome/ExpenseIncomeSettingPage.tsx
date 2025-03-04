'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CategoryType } from '../../types';
import DeleteDialog from './molecules/DeleteDialog';
import MergeDialog from './molecules/MergeDialog';
import CategoryTable from './organisms/CategoryTable';

const defaultCategories: CategoryType[] = [
  {
    id: '1',
    name: 'Food and Drink',
    type: 'EXPENSE',
    subCategories: [{ id: '1', name: 'Breakfast' }],
  },
  { id: '2', name: 'Stay and Rest', type: 'EXPENSE', subCategories: [{ id: '1', name: 'Hotel' }] },
  {
    id: '3',
    name: 'Salary',
    type: 'INCOME',
    subCategories: [
      { id: '1', name: 'Main Job' },
      { id: '2', name: 'Part-time Job' },
    ],
  },
  { id: '4', name: 'Saving', type: 'INCOME', subCategories: [{ id: '1', name: 'Bank Interest' }] },
];

export default function ExpenseIncomeSettingPage2() {
  const [categories, setCategories] = useState(defaultCategories);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>();
  const [newCategory, setNewCategory] = useState({ name: '', type: 'EXPENSE', subCategories: [] });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const handleCreateOrUpdateCategory = () => {
    if (selectedCategory) {
      setCategories(
        categories.map((cat) => (cat.id === selectedCategory.id ? selectedCategory : cat)),
      );
    } else {
      setCategories([...categories, { ...newCategory, id: String(categories.length + 1) }]);
    }
    setDialogOpen(false);
    setSelectedCategory(undefined);
  };

  const handleDeleteCategory = () => {
    setCategories(categories.filter((category) => category.id !== selectedCategory?.id));
    setDeleteConfirmOpen(false);
  };

  return (
    <section>
      <Button onClick={() => setDialogOpen(true)}>Add New Category</Button>
      {['EXPENSE', 'INCOME'].map((type) => (
        <div key={type} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            {type === 'EXPENSE' ? 'Expense Categories' : 'Income Categories'}
          </h2>
          <CategoryTable
            categories={categories}
            type={type}
            setSelectedCategory={setSelectedCategory}
            setDeleteConfirmOpen={setDeleteConfirmOpen}
            setDialogOpen={setDialogOpen}
          />
        </div>
      ))}

      <MergeDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        handleCreateOrUpdateCategory={handleCreateOrUpdateCategory}
      />

      <DeleteDialog
        deleteConfirmOpen={deleteConfirmOpen}
        setDeleteConfirmOpen={setDeleteConfirmOpen}
        handleDeleteCategory={handleDeleteCategory}
      />
    </section>
  );
}
