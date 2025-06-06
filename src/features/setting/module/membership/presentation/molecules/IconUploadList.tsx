'use client';

import UploadField from '@/components/common/forms/upload/UploadField';

export interface IconUploadItem {
  id: string;
  name: string;
  placeholder: string;
  value: File | null;
}

interface IconUploadListProps {
  items: IconUploadItem[];
  onChange: (items: IconUploadItem[]) => void;
  className?: string;
}

const IconUploadList = ({ items, onChange, className }: IconUploadListProps) => {
  const handleIconChange = (id: string, file: File | null) => {
    const updatedItems = items.map((item) => (item.id === id ? { ...item, value: file } : item));
    onChange(updatedItems);
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
      {items.map((item) => (
        <div key={item.id} className=" p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
          <UploadField
            name={item.id}
            value={item.value}
            onChange={(file) => handleIconChange(item.id, file)}
            placeholder={item.placeholder}
            previewShape="square"
          />
        </div>
      ))}
    </div>
  );
};

export default IconUploadList;
