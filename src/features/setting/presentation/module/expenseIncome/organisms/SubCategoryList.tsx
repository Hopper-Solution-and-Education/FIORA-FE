'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface SubCategoriesProps {
  subCategories: { id: string; name: string }[];
  editable?: boolean;
  handleUpdateSubCategoryName: (id: string, newName: string) => void; // Added for updating name
  handleAddSubCategory: () => void; // Added for adding subcategory
  handleRemoveSubCategory: (id: string) => void; // Added for removing subcategory
}

export default function SubCategoryList({
  subCategories,
  editable = false,
  handleUpdateSubCategoryName,
  handleAddSubCategory,
  handleRemoveSubCategory,
}: SubCategoriesProps) {
  const [expanded, setExpanded] = useState(false);
  const [subCategoryList, setSubCategoryList] = useState(subCategories);

  const handleChangeSubCategory = (id: string, value: string) => {
    handleUpdateSubCategoryName(id, value);
    const updatedSubCategories = subCategoryList.map((sub) =>
      sub.id === id ? { ...sub, name: value } : sub,
    );
    setSubCategoryList(updatedSubCategories);
  };

  return (
    <div>
      <ul className="list-disc list-inside">
        {(expanded ? subCategoryList : subCategoryList.slice(0, 3)).map((sub, index) => (
          <li key={sub.id} className="flex justify-between items-center mb-1">
            {editable ? (
              <input
                className="border px-2 py-1"
                value={sub.name}
                onChange={(e) => handleChangeSubCategory(sub.id, e.target.value)}
              />
            ) : (
              <span>{sub.name}</span>
            )}
            {editable && (
              <Button
                size="sm"
                variant="ghost"
                className="text-red-500"
                onClick={() => handleRemoveSubCategory(sub.id)} // Remove subcategory
              >
                ✕
              </Button>
            )}
          </li>
        ))}
      </ul>
      {subCategoryList.length > 3 && (
        <Button variant="link" onClick={() => setExpanded(!expanded)}>
          {expanded ? 'Show Less' : 'Show More'}
        </Button>
      )}
      {editable && (
        <Button size="sm" variant="outline" onClick={handleAddSubCategory} className="mt-2">
          + Add Subcategory
        </Button>
      )}
    </div>
  );
}
