import GlobalFilter from '@/components/common/filters/GlobalFilter';
import MultiSelectFilter from '@/components/common/filters/MultiSelectFilter';
import NumberRangeFilter from '@/components/common/filters/NumberRangeFilter';
import { FilterColumn, FilterComponentConfig, FilterOperator } from '@/shared/types/filter.types';
import { WALLET_SETTING_FILTER_OPTIONS } from '../../data/constant';
import { WalletSettingFilterGroup } from '../../data/types/walletSettingFilter.types';

const DEFAULT_MIN_AMOUNT = 0;
const DEFAULT_MAX_AMOUNT = 1000000;

interface WalletSettingFilterMenuProps {
  value: WalletSettingFilterGroup;
  onFilterChange: (newFilter: WalletSettingFilterGroup) => void;
  onApply: () => void;
}

function filterGroupToParams(filter: WalletSettingFilterGroup) {
  let status: string[] = [];
  let amountMin = DEFAULT_MIN_AMOUNT;
  let amountMax = DEFAULT_MAX_AMOUNT;
  let search = '';
  (filter.rules || []).forEach((rule) => {
    if ('field' in rule) {
      if (rule.field === 'status' && rule.operator === FilterOperator.IN) {
        status = Array.isArray(rule.value)
          ? rule.value.filter((v): v is string => typeof v === 'string')
          : [];
      }
      if (rule.field === 'amount' && rule.operator === FilterOperator.BETWEEN) {
        if (Array.isArray(rule.value)) {
          amountMin = typeof rule.value[0] === 'number' ? rule.value[0] : DEFAULT_MIN_AMOUNT;
          amountMax = typeof rule.value[1] === 'number' ? rule.value[1] : DEFAULT_MAX_AMOUNT;
        }
      }
      if (rule.field === 'search' && rule.operator === FilterOperator.CONTAINS) {
        search = typeof rule.value === 'string' ? rule.value : '';
      }
    }
  });
  return { status, amountMin, amountMax, search };
}

function paramsToFilterGroup(params: any): WalletSettingFilterGroup {
  const rules = [];
  const statusValues = (params.status || []).filter((v: string) => v !== 'all');
  if (params.search && params.search.trim() !== '') {
    rules.push({ field: 'search', operator: FilterOperator.CONTAINS, value: params.search });
  }
  if (statusValues.length > 0) {
    rules.push({ field: 'status', operator: FilterOperator.IN, value: statusValues });
  }
  const min = typeof params.amountMin === 'number' ? params.amountMin : DEFAULT_MIN_AMOUNT;
  const max = typeof params.amountMax === 'number' ? params.amountMax : DEFAULT_MAX_AMOUNT;
  if (min !== DEFAULT_MIN_AMOUNT || max !== DEFAULT_MAX_AMOUNT) {
    rules.push({ field: 'amount', operator: FilterOperator.BETWEEN, value: [min, max] });
  }
  return { condition: 'AND' as const, rules };
}

const WalletSettingFilterMenu = ({
  value,
  onFilterChange,
  onApply,
}: WalletSettingFilterMenuProps) => {
  const filterParams = filterGroupToParams(value);

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
      />
    </div>
  );
};

export default WalletSettingFilterMenu;
