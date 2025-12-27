import { useAppDispatch, useAppSelector } from '@/store';
import { logout } from '@/store/slices/user.slice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout());
  };

  return {
    user,
    isAuthenticated: !!user,
    logout: handleLogout,
  };
};
