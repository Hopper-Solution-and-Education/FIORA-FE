import { useAppDispatch, useAppSelector } from '@/store';
import { createPackageFx } from '../slices/actions';

export function useCreatePackageFx() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.packageFx.packages.isLoading);
  const error = useAppSelector((state) => state.packageFx.packages.error);
  const data = useAppSelector((state) => state.packageFx.packages.data);

  const createPackageFxHandler = (payload: {
    fxAmount: number;
    createdBy?: string;
    attachments?: File[];
  }) => {
    return dispatch(createPackageFx(payload));
  };

  return { createPackageFx: createPackageFxHandler, loading, error, data };
}

export default useCreatePackageFx;
