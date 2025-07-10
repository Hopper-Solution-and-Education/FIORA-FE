import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RootState } from '@/store';
import { debounce } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { WalletSettingFilterGroup } from '../../data/types/walletSettingFilter.types';
import { setWalletSettingFilter, setWalletSettingSearch } from '../../slices';
import { WalletSettingFilterMenu, WalletSettingSearch } from '../molecules';
import WalletSettingColumnMenu from '../molecules/WalletSettingColumnMenu';

interface WalletSettingTopBarActionProps {
  className?: string;
}

const WalletSettingTopBarAction = ({ className }: WalletSettingTopBarActionProps) => {
  const dispatch = useDispatch();
  const filterFromRedux = useSelector((state: RootState) => state.walletSetting.filter);
  const searchFromRedux = useSelector((state: RootState) => state.walletSetting.search);

  // Local state for filter and search
  const [localFilter, setLocalFilter] = useState<WalletSettingFilterGroup>(filterFromRedux);
  const [localSearch, setLocalSearch] = useState<string>(searchFromRedux);

  useEffect(() => {
    setLocalFilter(filterFromRedux);
  }, [filterFromRedux]);
  useEffect(() => {
    setLocalSearch(searchFromRedux);
  }, [searchFromRedux]);

  // Debounced search handler (stable instance)
  const debouncedSetSearch = useMemo(
    () =>
      debounce((value: string) => {
        dispatch(setWalletSettingSearch(value));
      }, 400),
    [dispatch],
  );

  // Search change handler
  const handleSearchChange = useCallback(
    (value: string) => {
      setLocalSearch(value);
      debouncedSetSearch(value);
    },
    [debouncedSetSearch],
  );

  const handleLocalFilterChange = useCallback((newFilter: WalletSettingFilterGroup) => {
    setLocalFilter(newFilter);
  }, []);

  // Apply changes to redux (and trigger API)
  const handleApply = useCallback(() => {
    dispatch(setWalletSettingFilter(localFilter));
  }, [dispatch, localFilter]);

  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      <WalletSettingSearch value={localSearch} onChange={handleSearchChange} />
      <WalletSettingFilterMenu
        value={localFilter}
        onFilterChange={handleLocalFilterChange}
        onApply={handleApply}
      />

      <div className="ml-auto">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-md hover:bg-accent hover:text-accent-foreground px-5 transition-colors"
            >
              <Icons.slidersHorizontal className="w-5 h-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-max" align="end" sideOffset={8}>
            <WalletSettingColumnMenu />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default WalletSettingTopBarAction;
