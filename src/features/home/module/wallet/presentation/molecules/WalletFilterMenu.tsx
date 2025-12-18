'use client';

import GlobalFilter from '@/components/common/filters/GlobalFilter';
import MultiSelectFilter from '@/components/common/filters/MultiSelectFilter';
import NumberRangeFilter from '@/components/common/filters/NumberRangeFilter';
import { FilterColumn, FilterCriteria } from '@/shared/types';
import { useAppDispatch } from '@/store';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_MAX_BALANCE,
  DEFAULT_MIN_BALANCE,
  DEFAULT_SLIDER_STEP,
  DEFAULT_WALLET_FILTER_CRITERIA,
  WALLET_TYPE_OPTIONS,
} from '../../data/constant';
import { setFilterCriteria } from '../../slices';
import { createWalletFilterStructure, extractWalletFilterData } from '../../utils';
import { WalletFilterParams, filterParamsInitState } from '../types/filter.type';

interface WalletFilterMenuProps {
  onFilterChange: (newFilter: FilterCriteria) => void;
  filterCriteria: FilterCriteria;
  minBalance?: number;
  maxBalance?: number;
}

const WalletFilterMenu = ({
  onFilterChange,
  filterCriteria,
  minBalance,
  maxBalance,
}: WalletFilterMenuProps) => {
  const [filterParams, setFilterParams] = useState<WalletFilterParams>(filterParamsInitState);
  const [isInitialized, setIsInitialized] = useState(false);

  const dispatch = useAppDispatch();

  const minRange = typeof minBalance === 'number' ? minBalance : DEFAULT_MIN_BALANCE;
  const maxRange = typeof maxBalance === 'number' ? maxBalance : DEFAULT_MAX_BALANCE;

  // Use util for extracting filter data
  const getFilterParamsFromCriteria = useCallback(
    (criteria: FilterCriteria) => extractWalletFilterData(criteria, minRange, maxRange),
    [minRange, maxRange],
  );

  // Use util for creating filter structure
  const getFilterStructure = useCallback(
    (params: WalletFilterParams) => createWalletFilterStructure(params, minRange, maxRange),
    [minRange, maxRange],
  );

  useEffect(() => {
    if (!isInitialized) {
      const { walletTypes, balanceMin, balanceMax } = getFilterParamsFromCriteria(filterCriteria);
      setFilterParams({
        walletTypes,
        balanceMin,
        balanceMax,
      });
      setIsInitialized(true);
    }
  }, [filterCriteria, getFilterParamsFromCriteria, isInitialized]);

  // Reset initialization flag when filter criteria changes externally
  useEffect(() => {
    setIsInitialized(false);
  }, [filterCriteria]);

  // =====================
  // Handlers
  // =====================
  const handleEditFilter = (target: keyof WalletFilterParams, value: string[] | number) => {
    setFilterParams((prev) => ({
      ...prev,
      [target]: value,
    }));
  };

  const handleFilterChange = useCallback(
    (newFilter: FilterCriteria) => {
      const structuredFilter: FilterCriteria = {
        userId: newFilter.userId || '',
        filters: newFilter.filters || {},
      };
      dispatch(setFilterCriteria(structuredFilter));
      onFilterChange(structuredFilter);
    },
    [dispatch, onFilterChange],
  );

  const filterComponents = useMemo(() => {
    const walletTypeFilterComponent = (
      <MultiSelectFilter
        options={WALLET_TYPE_OPTIONS}
        selectedValues={filterParams.walletTypes}
        onChange={(values) => handleEditFilter('walletTypes', values)}
        label="Wallet Type"
        placeholder="Select wallet types"
      />
    );
    const balanceFilterComponent = (
      <NumberRangeFilter
        minValue={filterParams.balanceMin}
        maxValue={filterParams.balanceMax}
        minRange={minRange}
        maxRange={maxRange}
        onValueChange={(target, value) =>
          handleEditFilter(target === 'minValue' ? 'balanceMin' : 'balanceMax', value)
        }
        label="Balance Range"
        minLabel="Min Balance"
        maxLabel="Max Balance"
        step={DEFAULT_SLIDER_STEP}
      />
    );
    return [
      {
        key: 'walletTypeFilter',
        component: walletTypeFilterComponent,
        column: FilterColumn.LEFT,
        order: 0,
      },
      {
        key: 'balanceFilter',
        component: balanceFilterComponent,
        column: FilterColumn.LEFT,
        order: 1,
      },
    ];
  }, [filterParams, minRange, maxRange]);

  return (
    <GlobalFilter
      filterParams={filterParams as unknown as Record<string, unknown>}
      filterComponents={filterComponents}
      onFilterChange={handleFilterChange}
      defaultFilterCriteria={DEFAULT_WALLET_FILTER_CRITERIA}
      structureCreator={(params: WalletFilterParams) => getFilterStructure(params)}
      currentFilter={filterCriteria.filters}
    />
  );
};

export default WalletFilterMenu;
