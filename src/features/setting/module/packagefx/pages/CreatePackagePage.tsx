'use client';

import { useIsMobile } from '@/shared/hooks/useIsMobile';
import { cn } from '@/shared/utils';
import CreatePackageForm from '../components/CreatePackageForm';

const CreatePackagePage = () => {
  const isMobile = useIsMobile();
  return (
    <div className={cn('w-full', isMobile ? 'px-4 py-4' : 'px-16 pb-8 md:px-32 lg:px-52 py-6')}>
      <div className="max-w-2xl mx-auto">
        <CreatePackageForm open={true} onClose={() => {}} />
      </div>
    </div>
  );
};

export default CreatePackagePage;
