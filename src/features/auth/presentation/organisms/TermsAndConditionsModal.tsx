/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import Loading from '@/components/common/atoms/Loading';
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
import { Document, Page, pdfjs } from 'react-pdf';

import type { PDFDocumentProxy } from 'pdfjs-dist';
import { Check, CircleX } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const options = {
  cMapUrl: '/cmaps/',
  standardFontDataUrl: '/standard_fonts/',
};

type PDFFile = string | File | null;

type TermsAndConditionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  onDecline: () => void;
};

const TermsAndConditionsModal = ({
  isOpen,
  onClose,
  onAccept,
  onDecline,
}: TermsAndConditionModalProps) => {
  const file: PDFFile = '/docs/sample-terms-and-conditions.pdf';
  const [numPages, setNumPages] = useState<number>();
  const [pageWidth, setPageWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isButtonActive, setIsButtonActive] = useState(false);

  function onDocumentLoadSuccess({ numPages: nextNumPages }: PDFDocumentProxy): void {
    setNumPages(nextNumPages);
  }

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

  useEffect(() => {
    // Reset button state when modal opens
    if (isOpen) {
      setIsButtonActive(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      // Set initial width
      setPageWidth(container.offsetWidth);

      // Add scroll event listener
      container.addEventListener('scroll', handleScroll);

      // Add resize listener to update page width if window resizes
      const handleResize = () => {
        setPageWidth(container.offsetWidth);
      };
      window.addEventListener('resize', handleResize);

      // Cleanup
      return () => {
        container.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [containerRef.current, numPages]);

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
          {typeof window !== 'undefined' ? (
            <Document
              file={file}
              className={`relative w-full h-fit`}
              onLoadSuccess={onDocumentLoadSuccess}
              options={options}
              loading={<Loading />}
            >
              {Array.from(new Array(numPages), (_el, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  loading={<div />}
                  width={pageWidth}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              ))}
              {/* Add padding at the bottom to ensure scrolling works correctly */}
              <div className="h-10"></div>
            </Document>
          ) : (
            <Loading />
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
