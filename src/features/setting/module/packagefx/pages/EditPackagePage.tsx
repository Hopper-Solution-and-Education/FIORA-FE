'use client';

import { useIsMobile } from '@/shared/hooks/useIsMobile';
import { cn } from '@/shared/utils';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Nếu bạn dùng Redux:
import { useAppDispatch, useAppSelector } from '@/store';
import { getPackageFxById } from '../slices/actions'; // thunk bạn đã có

import EditPackageForm from '../components/EditPackageForm';

interface EditPackagePageProps {
  packageId: string;
}

const EditPackagePage = ({ packageId }: EditPackagePageProps) => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const dispatch = useAppDispatch();
  const listInStore = useAppSelector((s) => s.packageFx?.packages?.data) as any[] | undefined;
  const [pkg, setPkg] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const hit = Array.isArray(listInStore)
      ? listInStore.find((x: any) => x.id === packageId)
      : null;

    if (hit) {
      setPkg(hit);
      setLoading(false);
      return;
    }
    setLoading(true);
    dispatch(getPackageFxById(packageId))
      .unwrap()
      .then((res: any) => {
        if (!mounted) return;
        setPkg(res.data);
      })
      .catch(async () => {
        try {
          const r = await fetch(`/api/wallet/package?id=${packageId}`);
          const j = await r.json();
          if (mounted) setPkg(j.data ?? null);
        } catch {
          if (mounted) setPkg(null);
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [packageId, listInStore, dispatch]);

  const handleCancel = () => router.back();
  const handleSubmit = () => router.push('/setting/packagefx');

  return (
    <div className={cn('w-full', isMobile ? 'px-4 py-4' : 'px-16 pb-8 md:px-32 lg:px-52 py-6')}>
      <div className="max-w-2xl mx-auto">
        {loading ? (
          <div className="text-sm text-gray-500">Loading package...</div>
        ) : pkg ? (
          <EditPackageForm pkg={pkg} onCancel={handleCancel} onSubmit={handleSubmit} />
        ) : (
          <div className="text-sm text-red-500">Package not found.</div>
        )}
      </div>
    </div>
  );
};

export default EditPackagePage;
