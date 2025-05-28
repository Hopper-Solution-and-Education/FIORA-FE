import { Icons } from '@/components/Icon';
import { DateRangePicker } from '@/components/modern-ui/date-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppDispatch, useAppSelector } from '@/store';
import { DateRange } from 'react-day-picker';
import { setSelectedAccounts, setSelectedPartners, setSelectedProducts } from '../../slices';
import { ViewBy } from '../../slices/types';
import { chartComponents } from '../../utils';
import { MultiSelectPickerFinance, ViewByCategorySelect } from '../atoms';

const viewByIcons: Record<ViewBy, keyof typeof Icons> = {
  date: 'calendar',
  category: 'kanban',
  account: 'banknote',
  product: 'package',
  partner: 'handShake',
};

const FilterByViewType = ({
  viewBy,
  dateRange,
  setDateRange,
  onViewByChange,
}: {
  viewBy: ViewBy;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  onViewByChange: (value: ViewBy) => void;
}) => {
  const accounts = useAppSelector((state) => state.financeControl.accounts.data);
  const products = useAppSelector((state) => state.financeControl.products.data);
  const partners = useAppSelector((state) => state.financeControl.partners.data);
  const selectedAccounts = useAppSelector((state) => state.financeControl.selectedAccounts);
  const selectedProducts = useAppSelector((state) => state.financeControl.selectedProducts);
  const selectedPartners = useAppSelector((state) => state.financeControl.selectedPartners);
  const dispatch = useAppDispatch();

  const handleChangeAccounts = (values: string[]) => {
    dispatch(setSelectedAccounts(values));
  };

  const handleChangeProducts = (values: string[]) => {
    dispatch(setSelectedProducts(values));
  };

  const handleChangePartners = (values: string[]) => {
    dispatch(setSelectedPartners(values));
  };

  const renderIcon = (type: ViewBy) => {
    const IconComponent = Icons[viewByIcons[type]];
    return IconComponent ? <IconComponent className="w-4 h-4" /> : null;
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-sm font-medium whitespace-nowrap">View By</span>
        <div className="w-32">
          <Select value={viewBy} onValueChange={(value) => onViewByChange(value as ViewBy)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a view">
                {viewBy && (
                  <div className="flex items-center gap-2">
                    {renderIcon(viewBy)}
                    <span>{viewBy.charAt(0).toUpperCase() + viewBy.slice(1)}</span>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Object.keys(chartComponents).map((key) => (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center gap-2">
                    {renderIcon(key as ViewBy)}
                    <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {viewBy === 'date' && (
        <DateRangePicker
          dateRange={dateRange}
          setDateRange={setDateRange}
          placeholder="Select date range"
          numberOfMonths={2}
        />
      )}
      {viewBy === 'category' && <ViewByCategorySelect />}
      {viewBy === 'account' && (
        <MultiSelectPickerFinance
          label=""
          placeholder="Select accounts"
          options={accounts.map((account) => ({
            label: account.name,
            value: account.id,
            icon: account.icon,
          }))}
          selectedValues={selectedAccounts}
          onChange={handleChangeAccounts}
        />
      )}
      {viewBy === 'product' && (
        <MultiSelectPickerFinance
          label=""
          placeholder="Select products"
          options={products.map((product) => ({
            label: product.name,
            value: product.id,
            icon: product.icon,
          }))}
          selectedValues={selectedProducts}
          onChange={handleChangeProducts}
        />
      )}
      {viewBy === 'partner' && (
        <MultiSelectPickerFinance
          label=""
          placeholder="Select partners"
          options={partners.map((partner) => ({
            label: partner.name,
            value: partner.id,
            icon: partner.logo,
          }))}
          selectedValues={selectedPartners}
          onChange={handleChangePartners}
        />
      )}
    </div>
  );
};

export default FilterByViewType;
