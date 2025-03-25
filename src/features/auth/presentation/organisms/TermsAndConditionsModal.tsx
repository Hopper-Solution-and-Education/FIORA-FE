'use client';

import Loading from '@/components/common/Loading';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DialogClose } from '@radix-ui/react-dialog';
import { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import type { PDFDocumentProxy } from 'pdfjs-dist';

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

  function onDocumentLoadSuccess({ numPages: nextNumPages }: PDFDocumentProxy): void {
    setNumPages(nextNumPages);
  }

  useEffect(() => {
    if (containerRef.current) {
      setPageWidth(containerRef.current.offsetWidth); // Set the width of the page based on parent container's width
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef.current]); // Recalculate when the component is mounted or the ref is updated

  return (
    <Dialog open={isOpen} onOpenChange={onClose} defaultOpen={false}>
      <DialogContent className="w-[80%] max-w-[70vw]">
        <DialogHeader>
          <DialogTitle>Terms and Conditions</DialogTitle>
          <DialogDescription>Please read the terms and conditions carefully.</DialogDescription>
        </DialogHeader>
        <div ref={containerRef} className="h-[70vh] overflow-y-scroll overflow-x-scroll">
          {typeof window !== 'undefined' ? (
            <Document
              file={file}
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
            </Document>
          ) : (
            <Loading />
          )}
        </div>

        <DialogFooter className="w-full h-fit flex flex-row !justify-center items-center gap-5">
          <DialogClose onClick={onDecline}>
            <Button className="bg-gray-300 hover:bg-gray-400 text-black w-[10vw] min-w-fit">
              Decline
            </Button>
          </DialogClose>

          <DialogTrigger onClick={onAccept}>
            <Button className="bg-blue-100 hover:bg-blue-200 text-blue-800 w-[10vw] min-w-fit">
              Accept
            </Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TermsAndConditionsModal;
