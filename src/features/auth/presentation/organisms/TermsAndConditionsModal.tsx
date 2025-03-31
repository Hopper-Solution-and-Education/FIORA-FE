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
  const [pageWidth, setPageWidth] = useState<number>(0); // State to hold the width of the page
  const containerRef = useRef<HTMLDivElement | null>(null); // Ref for the parent container
  const targetDivRef = useRef(null);
  const [isButtonActive, setIsButtonActive] = useState(false);

  function onDocumentLoadSuccess({ numPages: nextNumPages }: PDFDocumentProxy): void {
    setNumPages(nextNumPages);
  }

  useEffect(() => {
    const options = {
      root: null, // viewport
      rootMargin: '0px',
      threshold: 0.5, // trigger when 50% of the div is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // Update button state based on visibility
        setIsButtonActive(entry.isIntersecting);
      });
    }, options);

    // Start observing the target element
    if (targetDivRef.current) {
      observer.observe(targetDivRef.current);
    }

    // Cleanup observer on component unmount
    return () => {
      if (targetDivRef.current) {
        observer.unobserve(targetDivRef.current);
      }
    };
  }, [targetDivRef.current]);

  useEffect(() => {
    if (containerRef.current) {
      setPageWidth(containerRef.current.offsetWidth); // Set the width of the page based on parent container's width
    }
  }, [containerRef.current]); // Recalculate when the component is mounted or the ref is updated

  return (
    <Dialog open={isOpen} onOpenChange={onClose} defaultOpen={false}>
      <DialogContent className="w-[80%] max-w-[60vw]">
        <DialogHeader>
          <DialogTitle>Terms and Conditions</DialogTitle>
          <DialogDescription>Please read the terms and conditions carefully.</DialogDescription>
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
                  width={pageWidth} // Use the width from the state
                  renderTextLayer={false} // Optional: Disable the text layer for better rendering performance
                  renderAnnotationLayer={false} // Optional: Enable the annotation layer for interactive features
                />
              ))}
              <div ref={targetDivRef} className="target-div h-5"></div>
            </Document>
          ) : (
            <Loading />
          )}
        </div>

        <DialogFooter className="w-full h-fit flex flex-row !justify-center items-center gap-5">
          <DialogClose onClick={onDecline}>
            <Button className="bg-red-200 hover:bg-red-300  w-[10vw] h-fit min-w-fit">
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
