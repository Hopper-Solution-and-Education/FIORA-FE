import GlobalFilter from '@/components/common/filters/GlobalFilter';
import MultiSelectFilter from '@/components/common/filters/MultiSelectFilter';
import NumberRangeFilter from '@/components/common/filters/NumberRangeFilter';
import {
  DynamicFilterGroup,
  FilterColumn,
  FilterComponentConfig,
} from '@/shared/types/filter.types';
import { useAppDispatch, useAppSelector } from '@/store';
import { DEFAULT_MAX_AMOUNT, DEFAULT_MIN_AMOUNT, WALLET_SETTING_FILTER_OPTIONS } from '../../data';
import { clearFilter } from '../../slices';
import { filterGroupToParams, paramsToFilterGroup } from '../utils';

interface WalletSettingFilterMenuProps {
  value: DynamicFilterGroup;
  onFilterChange: (newFilter: DynamicFilterGroup) => void;
  onApply: () => void;
}

const WalletSettingFilterMenu = ({
  value,
  onFilterChange,
  onApply,
}: WalletSettingFilterMenuProps) => {
  const dispatch = useAppDispatch();
  const skipFilters = useAppSelector((state) => state.walletSetting.skipFilters);

  const filterParams = filterGroupToParams(value);

  const handleClearFilter = () => {
    dispatch(clearFilter());
  };

  const isFilterApplied = !skipFilters;

  const filterComponents: FilterComponentConfig[] = [
    {
      key: 'status',
      component: (
        <MultiSelectFilter
          options={WALLET_SETTING_FILTER_OPTIONS as any}
          selectedValues={filterParams.status}
          onChange={(values) => {
            onFilterChange(paramsToFilterGroup({ ...filterParams, status: values }));
          }}
          label="Status"
          placeholder="Select status"
        />
      ),
      column: FilterColumn.LEFT,
      order: 0,
    },
    {
      key: 'amount',
      component: (
        <NumberRangeFilter
          minValue={filterParams.amountMin ?? DEFAULT_MIN_AMOUNT}
          maxValue={filterParams.amountMax ?? DEFAULT_MAX_AMOUNT}
          minRange={DEFAULT_MIN_AMOUNT}
          maxRange={DEFAULT_MAX_AMOUNT}
          onValueChange={(target, value) =>
            onFilterChange(
              paramsToFilterGroup({
                ...filterParams,
                amountMin: target === 'minValue' ? value : filterParams.amountMin,
                amountMax: target === 'maxValue' ? value : filterParams.amountMax,
              }),
            )
          }
          label="Amount Range"
          minLabel="Min Amount"
          maxLabel="Max Amount"
          step={100}
        />
      ),
      column: FilterColumn.LEFT,
      order: 1,
    },
  ];

  return (
    <div>
      <GlobalFilter
        filterParams={filterParams}
        filterComponents={filterComponents}
        onFilterChange={onApply}
        currentFilter={value}
        onResetFilter={handleClearFilter}
        showFilterIcon={isFilterApplied}
      />
    </div>
  );
};

export default WalletSettingFilterMenu;
