'use client';

import { ImageUploadListFieldConfig } from '../config';

interface IconUploadListProps {
  className?: string;
}

const IconUploadList = ({ className }: IconUploadListProps) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
      <ImageUploadListFieldConfig />
    </div>
  );
};

export default IconUploadList;
