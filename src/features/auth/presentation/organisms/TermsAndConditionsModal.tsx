'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DialogClose } from '@radix-ui/react-dialog';
import { useEffect, useRef, useState } from 'react';
import { Check, CircleX, Loader2, TriangleAlert } from 'lucide-react';

type TermsAndConditionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  onDecline: () => void;
  pdfUrl?: string;
};

const Loading = () => (
  <div className="fixed inset-0 flex flex-col items-center justify-center h-full w-full py-8">
    <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
    <h2 className="text-2xl font-semibold text-primary">Loading...</h2>
    <p className="text-gray-300 mt-2">Please wait while we prepare your content</p>
  </div>
);

const ErrorLoading = () => (
  <div className="fixed inset-0 flex flex-col items-center justify-center h-full w-full py-8">
    <TriangleAlert className="h-16 w-16 text-red-500 mb-4" />
    <h2 className="text-xl font-semibold text-red-500">Failed to load document</h2>
    <p className="text-gray-400 mt-2">
      An error occurred while loading the terms and conditions. Please try again later.
    </p>
  </div>
);

const TermsAndConditionsModal = (props: TermsAndConditionModalProps) => {
  const { isOpen, onClose, onAccept, onDecline, pdfUrl } = props;

  const defaultPdfUrl =
    'https://firebasestorage.googleapis.com/v0/b/hopper-3d98d.firebasestorage.app/o/Terms%20%26%20Conditions%2Fsample-terms-conditions-agreement.pdf?alt=media&token=cbbcd191-6ee1-4099-ba65-73714f9cf83d';

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const pdfUrlToUse = pdfUrl || defaultPdfUrl;

  const handleIframeLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setError('Failed to load PDF document');
  };

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setIsLoading(true);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose} defaultOpen={false}>
      <DialogContent className="w-[80%] max-w-[60vw] px-0 pb-3">
        <DialogHeader className="w-full px-4">
          <DialogTitle>Terms and Conditions</DialogTitle>
          <DialogDescription>Please read the terms and conditions carefully.</DialogDescription>
        </DialogHeader>
        <div className="h-[70vh] p-0 overflow-x-hidden relative">
          {isLoading && <Loading />}
          {error && <ErrorLoading />}
          <iframe
            ref={iframeRef}
            src={pdfUrlToUse}
            className="w-full border-0"
            title="Terms and Conditions"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            style={{
              display: isLoading || error ? 'none' : 'block',
              minHeight: '100%',
            }}
          />
        </div>

        <DialogFooter className="w-full h-fit flex flex-row !justify-center items-center gap-5">
          <DialogClose onClick={onDecline}>
            <Button className="bg-red-200 hover:bg-red-300 w-[10vw] h-fit min-w-fit">
              <CircleX className="block text-red-400 stroke-[3] transform transition-transform duration-200 drop-shadow-sm hover:text-red-200 !h-[23px] !w-[23px]" />
            </Button>
          </DialogClose>
          <Button
            onClick={onAccept}
            className="bg-green-200 hover:bg-green-300 text-green-800 w-[10vw] min-w-fit"
          >
            <Check className="block text-green-400 stroke-[3] transform transition-transform duration-200 drop-shadow-sm hover:text-green-300 !h-[23px] !w-[23px]" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TermsAndConditionsModal;
