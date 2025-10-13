import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { FormState } from 'react-hook-form';
import { CommonTooltip } from './CommonTooltip';

type SubmitButtonProps = {
  formState: FormState<any>;
  isLoading?: boolean;
  isDisabled?: boolean;
  onSubmit?: () => void;
};

const SubmitButton = ({ formState, isLoading, isDisabled, onSubmit }: SubmitButtonProps) => {
  return (
    <CommonTooltip content={formState.isSubmitting ? 'Submiting...' : 'Submit'}>
      <div className="flex justify-between gap-4 mt-6">
        <Button
          type="submit"
          onClick={onSubmit}
          disabled={
            !formState.isValid || formState.isSubmitting || formState.isValidating || isDisabled
          }
          className="w-32 h-12 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {formState.isSubmitting || isLoading ? (
            <Icons.spinner className="animate-spin h-5 w-5" />
          ) : (
            <Icons.check className="h-5 w-5" />
          )}
        </Button>
      </div>
    </CommonTooltip>
  );
};

export default SubmitButton;
