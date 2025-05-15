import { CustomDateTimePicker, FormConfig } from '@/components/common/forms';
import { Fragment } from 'react';
import { useFormContext } from 'react-hook-form';
import { BudgetGetFormValues } from '../schema';

import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store';
import { Check } from 'lucide-react';
import { resetGetBudgetState } from '../../slices';
import { getBudgetAsyncThunk } from '../../slices/actions/getBudgetAsyncThunk';

type Props = {
  onFilterDropdownOpenChange: (value: boolean) => void;
};

const BudgetDashboardFilter = ({ onFilterDropdownOpenChange }: Props) => {
  const methods = useFormContext<BudgetGetFormValues>();
  const dispatch = useAppDispatch();
  const currency = useAppSelector((state) => state.settings.currency);

  const { watch } = methods;

  const onSubmit = (data: BudgetGetFormValues) => {
    dispatch(resetGetBudgetState());
    dispatch(
      getBudgetAsyncThunk({
        cursor: null,
        search: '',
        currency,
        take: 3,
        filters: {
          fiscalYear: {
            lte: Number(data.toYear ?? 9999),
            gte: Number(data.fromYear ?? 0),
          },
        },
      }),
    );
  };

  const fields = [
    <CustomDateTimePicker
      key="fromYear"
      yearOnly
      name="fromYear"
      placeholder="From Year"
      label="From Year"
      isYearDisabled={(year) => (watch('toYear') ? year > Number(watch('toYear')) : false)}
    />,
    <CustomDateTimePicker
      key="toYear"
      yearOnly
      name="toYear"
      placeholder="To Year"
      label="To Year"
      isYearDisabled={(year) => (watch('fromYear') ? year < Number(watch('fromYear')) : false)}
    />,
  ];

  const renderButton = () => {
    return (
      <div className="flex justify-end gap-2 mt-4">
        <></>

        {/* Button Submit */}
        <Button
          type="submit"
          onClick={() => onFilterDropdownOpenChange(false)}
          size="icon"
          aria-label="Apply filters"
        >
          <Check className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <Fragment>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <FormConfig methods={methods} fields={fields} renderSubmitButton={renderButton} />
      </form>
    </Fragment>
  );
};

export default BudgetDashboardFilter;
