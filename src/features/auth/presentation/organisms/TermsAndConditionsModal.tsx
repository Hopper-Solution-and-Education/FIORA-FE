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
import { CircleCheck, CircleX } from 'lucide-react';

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
              <CircleX size={30} strokeWidth={2} color="red" />
            </Button>
          </DialogClose>
          <Button
            onClick={onAccept}
            disabled={!isButtonActive}
            className="bg-green-200 hover:bg-green-300 text-green-800 w-[10vw] min-w-fit"
          >
            {!isButtonActive ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.49985 0.877045C3.84216 0.877045 0.877014 3.84219 0.877014 7.49988C0.877014 9.1488 1.47963 10.657 2.47665 11.8162L1.64643 12.6464C1.45117 12.8417 1.45117 13.1583 1.64643 13.3535C1.8417 13.5488 2.15828 13.5488 2.35354 13.3535L3.18377 12.5233C4.34296 13.5202 5.85104 14.1227 7.49985 14.1227C11.1575 14.1227 14.1227 11.1575 14.1227 7.49988C14.1227 5.85107 13.5202 4.34299 12.5233 3.1838L13.3535 2.35354C13.5488 2.15827 13.5488 1.84169 13.3535 1.64643C13.1583 1.45117 12.8417 1.45117 12.6464 1.64643L11.8162 2.47668C10.657 1.47966 9.14877 0.877045 7.49985 0.877045ZM11.1422 3.15066C10.1567 2.32449 8.88639 1.82704 7.49985 1.82704C4.36683 1.82704 1.82701 4.36686 1.82701 7.49988C1.82701 8.88642 2.32446 10.1568 3.15063 11.1422L11.1422 3.15066ZM3.85776 11.8493C4.84317 12.6753 6.11343 13.1727 7.49985 13.1727C10.6328 13.1727 13.1727 10.6329 13.1727 7.49988C13.1727 6.11346 12.6753 4.8432 11.8493 3.85779L3.85776 11.8493Z"
                  fill="green"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                ></path>
              </svg>
            ) : (
              <CircleCheck size={30} strokeWidth={2} color="green" />
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TermsAndConditionsModal;
