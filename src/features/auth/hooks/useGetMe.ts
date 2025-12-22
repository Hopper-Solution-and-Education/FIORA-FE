import { authService } from '@/features/auth/services/auth.service';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { useAppDispatch } from '@/store';
import { setUserData } from '@/store/slices/user.slice';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export const useGetMe = () => {
  const dispatch = useAppDispatch();
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const hasToken =
      !!localStorage.getItem('accessToken') || !!localStorage.getItem('refreshToken');
    setIsEnabled(hasToken);
  }, []);

  const { data: response, isLoading } = useQuery({
    queryKey: ['getMe'],
    queryFn: () => authService.getMe(),
    enabled: isEnabled,
    retry: false,
  });

  useEffect(() => {
    if (response?.statusCode === RESPONSE_CODE.OK && response.data) {
      dispatch(setUserData({ user: response.data }));
    }
  }, [response, dispatch]);

  return {
    user: response?.data,
    isLoading,
  };
};
