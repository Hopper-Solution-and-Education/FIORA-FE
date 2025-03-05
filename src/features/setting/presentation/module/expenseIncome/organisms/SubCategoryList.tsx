'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface SubCategoriesProps {
  subCategories: { id: string; name: string }[];
  editable?: boolean;
}

export default function SubCategoryList({ subCategories, editable = false }: SubCategoriesProps) {
  const [expanded, setExpanded] = useState(false);
  const [subCategoryList, setSubCategoryList] = useState(subCategories);

  const handleAddSubCategory = () => {
    setSubCategoryList([...subCategoryList, { id: String(subCategoryList.length + 1), name: '' }]);
  };

  const handleRemoveSubCategory = (index: any) => {
    setSubCategoryList(subCategoryList.filter((_, i) => i !== index));
  };

  const handleChangeSubCategory = (index: any, value: any) => {
    const updatedSubCategories = [...subCategoryList];
    updatedSubCategories[index].name = value;
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
                onChange={(e) => handleChangeSubCategory(index, e.target.value)}
              />
            ) : (
              <span>{sub.name}</span>
            )}
            {editable && (
              <Button
                size="sm"
                variant="ghost"
                className="text-red-500"
                onClick={() => handleRemoveSubCategory(index)}
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
