import { CommonTooltip } from '@/components/common/atoms/CommonTooltip';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import React from 'react';

interface PostDetailHeaderProps {
  title?: string;
  canEdit: boolean;
  onEdit: () => void;
  hasContent?: boolean;
}

const PostDetailHeader: React.FC<PostDetailHeaderProps> = ({
  title,
  canEdit,
  onEdit,
  hasContent = true,
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      {canEdit && hasContent && (
        <CommonTooltip content="Edit">
          <Button variant="outline" className="h-fit w-fit !px-4 !py-2" onClick={onEdit}>
            <Pencil size={18} />
          </Button>
        </CommonTooltip>
      )}
    </div>
  );
};

export default PostDetailHeader;
