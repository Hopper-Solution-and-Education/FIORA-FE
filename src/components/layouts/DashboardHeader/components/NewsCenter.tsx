'use client';

import { CommonTooltip } from '@/components/common/atoms/CommonTooltip';
import { ICON_SIZE } from '@/shared/constants/size';
import { NewspaperIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NewsCenter() {
  const router = useRouter();
  return (
    <div
      className="flex flex-col gap-1 justify-center items-center group cursor-pointer"
      onClick={() => router.push('/news')}
    >
      <CommonTooltip content="News">
        <div className="p-2 rounded-lg transition-all duration-200 hover:bg-primary/10 dark:hover:bg-primary/20">
          <NewspaperIcon
            size={ICON_SIZE.MD}
            className="transition-all duration-200 text-foreground group-hover:text-primary group-hover:scale-110"
          />
        </div>
      </CommonTooltip>
      <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">
        News
      </span>
    </div>
  );
}
