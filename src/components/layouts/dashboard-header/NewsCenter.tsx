'use client';

import { ICON_SIZE } from '@/shared/constants/size';
import { NewspaperIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NewsCenter() {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-1 justify-center items-center">
      <NewspaperIcon
        onClick={() => router.push('/news')}
        size={ICON_SIZE.MD}
        className="transition-all duration-200 hover:scale-110 cursor-pointer"
      />
      <span className="text-sm">News</span>
    </div>
  );
}
