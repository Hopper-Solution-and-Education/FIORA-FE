import { Dispatch, SetStateAction, useState } from 'react';
import TermsAndConditionsModal from '../organisms/TermsAndConditionsModal';
import { cn } from '@/shared/utils';
import { Checkbox } from '@/components/ui/checkbox';

type TermConditionProps = {
  isTermAccepted: boolean;
  setIsTermAccepted: Dispatch<SetStateAction<boolean>>;
  isEditAlowed?: boolean;
};

export default function TermCondition(props: TermConditionProps) {
  const { isTermAccepted, setIsTermAccepted, isEditAlowed = true } = props;
  const [isTermsAndConditionsOpen, setIsTermsAndConditionsOpen] = useState<boolean>(false);

  const handleOpenTermModal = (event: any) => {
    event.preventDefault();
    if (isEditAlowed) {
      setIsTermsAndConditionsOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsTermsAndConditionsOpen(false);
  };

  const handleAcceptTerm = () => {
    setIsTermAccepted(true);
    setIsTermsAndConditionsOpen(false);
  };

  const handleRejectTerm = () => {
    setIsTermAccepted(false);
    setIsTermsAndConditionsOpen(false);
  };

  return (
    <>
      <div className="w-full flex items-center justify-center mt-3 gap-2">
        <Checkbox
          id="remember-me"
          checked={isTermAccepted}
          onCheckedChange={() => setIsTermAccepted((prev) => !prev)}
          className="h-4 w-4 cursor-pointer rounded border border-gray-300 dark:border-gray-600 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
        />
        <label htmlFor="terms" className="text-pretty text-xs text-muted-foreground">
          By clicking continue, you agree to our{' '}
          <a
            href="#"
            onClick={(event) => handleOpenTermModal(event)}
            className={cn(
              'underline underline-offset-4 hover:text-blue-600 text-blue-500',
              !isEditAlowed && 'cursor-not-allowed text-gray-400 hover:text-gray-400',
            )}
          >
            Terms and Conditions.
          </a>{' '}
        </label>
        <TermsAndConditionsModal
          isOpen={isTermsAndConditionsOpen}
          onClose={handleCloseModal}
          onAccept={handleAcceptTerm}
          onDecline={handleRejectTerm}
        />
      </div>
    </>
  );
}
