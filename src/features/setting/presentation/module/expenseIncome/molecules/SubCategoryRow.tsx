import React, { useState } from 'react';
import IconSelect from '@/components/common/IconSelect';
import { Input } from '@/components/ui/input';
import { Category } from '@/features/setting/presentation/settingSlices/expenseIncomeSlides/types';

interface SubCategoryRowProps {
  subCatory: Category;
  handleChangeSubCategory: (id: string, field: 'name' | 'icon', value: string) => void;
}

const SubCategoryRow: React.FC<SubCategoryRowProps> = ({ subCatory, handleChangeSubCategory }) => {
  const [subName, setSubName] = useState(subCatory.name);
  const [subIcon, setSubIcon] = useState(subCatory.icon);

  const handleChangeName = (value: string) => {
    setSubName(value);
    handleChangeSubCategory(subCatory.id, 'name', value);
  };

  const handleChangeIcon = (value: string) => {
    setSubIcon(value);
    handleChangeSubCategory(subCatory.id, 'icon', value);
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <Input
        type="email"
        placeholder="Name"
        value={subName}
        onChange={(e) => handleChangeName(e.target.value)}
      />
      <IconSelect selectedIcon={subIcon} onIconChange={(value) => handleChangeIcon(value)} />
    </div>
  );
};

export default SubCategoryRow;
