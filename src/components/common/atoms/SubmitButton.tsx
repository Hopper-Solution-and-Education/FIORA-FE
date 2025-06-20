import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FormState } from 'react-hook-form';

type SubmitButtonProps = {
  formState: FormState<any>;
  isLoading?: boolean;
  isDisabled?: boolean;
  onSubmit?: () => void;
};

const SubmitButton = ({ formState, isLoading, isDisabled, onSubmit }: SubmitButtonProps) => {
  return (
    <TooltipProvider>
      <div className="flex justify-between gap-4 mt-6">
        <Tooltip>
          <TooltipTrigger asChild>
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
          </TooltipTrigger>
          <TooltipContent>
            <p>{formState.isSubmitting ? 'Submiting...' : 'Submit'}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default SubmitButton;
