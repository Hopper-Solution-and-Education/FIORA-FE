import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import React from 'react';

interface PostDetailHeaderProps {
  title: string;
  canEdit: boolean;
  onEdit: () => void;
}

const PostDetailHeader: React.FC<PostDetailHeaderProps> = ({ title, canEdit, onEdit }) => {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold mx-auto">{title}</h1>
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
    </>
  );
};

export default PostDetailHeader;
