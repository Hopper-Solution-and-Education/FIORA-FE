// src/features/setting/pages/fx-package/hooks/useUpdatePackageFx.ts
'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { updatePackageFx } from '../slices/actions';

type UpdatePayload = {
  id: string;
  fxAmount: number;
  attachments?: attachmentFiles[];
  removeAttachmentIds?: string[];
};

export function useUpdatePackageFx() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((s) => s.packageFx.packages.isLoading);
  const error = useAppSelector((s) => s.packageFx.packages.error);
  const data = useAppSelector((s) => s.packageFx.packages.data);

  const update = (payload: UpdatePayload) => dispatch(updatePackageFx(payload));

  return { updatePackageFx: update, loading, error, data };
}

export default useUpdatePackageFx;
