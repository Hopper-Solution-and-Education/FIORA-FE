import { useCallback, useState } from 'react';
import { referralCronjobContainer } from '../../di/referralCronjobDashboardDI';
import { REFERRAL_CRONJOB_TYPES } from '../../di/referralCronjobDashboardDI.type';
import { IGetReferralFilterOptionsUseCase } from '../../domain/usecase/GetReferralFilterOptionsUseCase';

interface FilterOptions {
  emailReferrer: { value: string; label: string }[];
  emailReferee: { value: string; label: string }[];
  updatedBy: { value: string; label: string }[];
}

export const useReferralFilterOptions = () => {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    emailReferrer: [],
    emailReferee: [],
    updatedBy: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchFilterOptions = useCallback(async () => {
    // Nếu đã load rồi thì không load lại
    if (isInitialized) return;

    setLoading(true);
    setError(null);

    try {
      const useCase = referralCronjobContainer.get<IGetReferralFilterOptionsUseCase>(
        REFERRAL_CRONJOB_TYPES.IGetReferralFilterOptionsUseCase,
      );

      const response = await useCase.execute();

      // Transform API response to filter options format
      if (response.data) {
        const { emailReferrer = [], emailReferee = [], updatedBy = [] } = response.data;

        setFilterOptions({
          emailReferrer: emailReferrer.map((user: any) => ({
            value: user.id, // UI gửi ID
            label: user.email, // Hiển thị email cho user
          })),
          emailReferee: emailReferee.map((user: any) => ({
            value: user.id, // UI gửi ID
            label: user.email, // Hiển thị email cho user
          })),
          updatedBy: updatedBy.map((user: any) => ({
            value: user.id, // Updated By cũng gửi ID
            label: user.email, // Hiển thị email cho user
          })),
        });
        setIsInitialized(true);
      }
    } catch (err) {
      console.error('Error fetching filter options:', err);
      setError('Failed to load filter options');
      // Keep empty arrays as fallback
      setFilterOptions({
        emailReferrer: [],
        emailReferee: [],
        updatedBy: [],
      });
    } finally {
      setLoading(false);
    }
  }, [isInitialized]);

  // Không tự động load khi component mount
  // useEffect(() => {
  //   fetchFilterOptions();
  // }, [fetchFilterOptions]);

  return {
    filterOptions,
    loading,
    error,
    isInitialized,
    loadFilterOptions: fetchFilterOptions, // Method để load khi cần
  };
};
