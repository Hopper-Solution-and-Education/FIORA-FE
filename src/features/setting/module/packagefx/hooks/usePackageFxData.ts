import { useAppDispatch, useAppSelector } from '@/store';
import { useEffect, useState } from 'react';
import { fetchPackageFx } from '../slices/actions';
import { PackageFXWithAttachments } from '../slices/types';

export function usePackageFxData({
  page,
  limit,
  sortField,
  sortOrder,
}: {
  page: number;
  limit: number;
  sortField: string;
  sortOrder: 'asc' | 'desc';
}) {
  const dispatch = useAppDispatch();
  const totalPackages = useAppSelector((state) => state.packageFx.packages?.total || 0);
  const [packages, setPackages] = useState<PackageFXWithAttachments[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    dispatch(fetchPackageFx({ page, limit, sortBy: { [sortField]: sortOrder } }))
      .then((res: any) => {
        setPackages(res?.payload?.data ?? []);
      })
      .finally(() => setIsLoading(false));
  }, [dispatch, page, limit, sortField, sortOrder]);

  return { packages, totalPackages, isLoading };
}
