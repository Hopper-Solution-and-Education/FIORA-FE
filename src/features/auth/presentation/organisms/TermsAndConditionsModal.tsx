/* eslint-disable react-hooks/exhaustive-deps */
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
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

type TermsAndConditionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  onDecline: () => void;
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
  const { isOpen, onClose, onAccept, onDecline } = props;

  const pdfUrl = '/docs/sample-terms-and-conditions.pdf';
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);

  // Handle scroll event to check if user has reached the bottom
  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      // Check if user has scrolled to the bottom (with a small threshold)
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 20;

      if (isAtBottom) {
        setIsButtonActive(true);
      }
    }
  };

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  function onDocumentLoadError(error: Error) {
    console.error('Error loading PDF:', error);
    setError(error.message);
  }

  useEffect(() => {
    // Reset states when modal opens
    if (isOpen) {
      setIsButtonActive(false);
      setError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      // Add scroll event listener
      container.addEventListener('scroll', handleScroll);

      // Cleanup
      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, [containerRef.current]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose} defaultOpen={false}>
      <DialogContent className="w-[80%] max-w-[60vw]">
        <DialogHeader>
          <DialogTitle>Terms and Conditions</DialogTitle>
          <DialogDescription>
            Please read the terms and conditions carefully. Scroll to the end to accept.
          </DialogDescription>
        </DialogHeader>
        <div ref={containerRef} className="h-[70vh] overflow-y-scroll overflow-x-hidden">
          {error ? (
            <ErrorLoading />
          ) : (
            <div className="flex flex-col items-center w-full">
              <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={<Loading />}
                error={<ErrorLoading />}
              >
                {Array.from(new Array(numPages), (_, index) => (
                  <Page
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                    width={
                      containerRef.current?.clientWidth
                        ? containerRef.current.clientWidth - 30
                        : undefined
                    }
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                    className="mb-4"
                  />
                ))}
              </Document>
            </div>
          )}
        </div>

        <DialogFooter className="w-full h-fit flex flex-row !justify-center items-center gap-5">
          <DialogClose onClick={onDecline}>
            <Button className="bg-red-200 hover:bg-red-300 w-[10vw] h-fit min-w-fit">
              <CircleX className="block text-red-400 stroke-[3] transform transition-transform duration-200 drop-shadow-sm hover:text-red-200 !h-[23px] !w-[23px]" />
            </Button>
          </DialogClose>
          <Button
            onClick={onAccept}
            disabled={!isButtonActive}
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
