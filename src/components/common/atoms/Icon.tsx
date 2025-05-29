import LucieIcon from '@/features/home/module/category/components/LucieIcon';
import { isImageUrl } from '@/shared/utils';
import Image from 'next/image';
import React from 'react';

type Props = {
  icon: string;
};
const Icon = ({ icon }: Props) => {
  if (isImageUrl(icon)) {
    return (
      <div className="w-5 h-5 rounded-full overflow-hidden">
        <Image
          src={icon}
          alt="logo"
          width={20}
          height={20}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement?.classList.add(
              'flex',
              'items-center',
              'justify-center',
              'bg-gray-100',
            );
            const fallbackIcon = document.createElement('div');
            fallbackIcon.innerHTML =
              '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-gray-400"><circle cx="12" cy="8" r="5"></circle><path d="M20 21a8 8 0 0 0-16 0"></path></svg>';
            e.currentTarget.parentElement?.appendChild(fallbackIcon.firstChild as Node);
          }}
        />
      </div>
    );
  }

  return <LucieIcon icon={icon} className="w-4 h-4" />;
};

export default Icon;
