import { CustomDateTimePicker, FormConfig } from '@/components/common/forms';
import { Fragment } from 'react';
import { useFormContext } from 'react-hook-form';
import { BudgetGetFormValues } from '../schema';

const BudgetDashboardFilter = () => {
  const methods = useFormContext<BudgetGetFormValues>();

  const fields = [
    <CustomDateTimePicker
      key="fromYear"
      yearOnly
      name="fromYear"
      placeholder="Select From Year"
      label="From Year"
    />,
    <CustomDateTimePicker
      key="toYear"
      yearOnly
      name="toYear"
      placeholder="Select To Year"
      label="To Year"
    />,
  ];

  const renderButton = () => {
    return <></>;
  };

  return (
    <Fragment>
      <FormConfig methods={methods} fields={fields} renderSubmitButton={renderButton} />
    </Fragment>
  );
};

export default BudgetDashboardFilter;
