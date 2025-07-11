import { Button } from '@/components/ui/button';
import { Pencil, Trash } from 'lucide-react';
import React from 'react';
import type { FaqDetailData } from '../../domain/entities/models/faqs';

interface FaqHeaderProps {
  data: FaqDetailData;
  canEdit: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const FaqHeader: React.FC<FaqHeaderProps> = ({ data, canEdit, onEdit, onDelete }) => {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">{data.title}</h1>
        {canEdit && (
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              className="px-3 py-2 hover:bg-red-200"
              onClick={() => {
                onEdit?.();
              }}
            >
              <Pencil size={18} color="red" />
            </Button>
            <Button
              variant="secondary"
              className="px-3 py-2 hover:bg-red-200"
              onClick={() => {
                onDelete?.();
              }}
            >
              <Trash size={18} color="red" />
            </Button>
          </div>
        )}
      </div>

      {/* Meta information */}
      <p className="text-sm text-gray-500 mb-2">Posted by {data.User?.email || 'Unknown'}</p>
      <p className="text-sm text-gray-400 mb-4">
        Updated {new Date(data.updatedAt || data.createdAt).toLocaleString()}
      </p>
    </>
  );
};

export default FaqHeader;
