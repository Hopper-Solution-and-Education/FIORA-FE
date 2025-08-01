import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import React from 'react';
import type { Post } from '../../domain/entities/models/faqs';

interface AboutUsHeaderProps {
  data: Post;
  canEdit: boolean;
  onEdit: () => void;
}

const AboutUsHeader: React.FC<AboutUsHeaderProps> = ({ data, canEdit, onEdit }) => {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">{data.title}</h1>
        {canEdit && (
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              className="px-3 py-2 hover:bg-green-200"
              onClick={() => {
                onEdit();
              }}
            >
              <Pencil size={18} />
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

export default AboutUsHeader;
