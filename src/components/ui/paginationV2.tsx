'use client';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

import { type ButtonProps, buttonVariants } from '@/components/ui/button';
import { cn } from '@/shared/utils';

export interface PaginationV2Props {
  className?: string;
  count: number;
  page: number;
  pageSize?: number;
  siblingCount?: number;
  variant?: 'outline' | 'ghost';
  onPageChange: (page: number) => void;
  showFirstButton?: boolean;
  showLastButton?: boolean;
  total?: number;
  onChange?: (page: number, pageSize: number) => void;
}

const PaginationV2 = ({
  className,
  count,
  page,
  pageSize = 10,
  siblingCount = 1,
  variant = 'outline',
  onPageChange,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  showFirstButton = false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  showLastButton = false,
  ...props
}: PaginationV2Props) => {
  const totalPages = Math.ceil(count / pageSize);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { total, onChange, ...restProps } = props;

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const leftSiblingIndex = Math.max(page - siblingCount, 1);
    const rightSiblingIndex = Math.min(page + siblingCount, totalPages);

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;

    if (showLeftDots && showRightDots) {
      pageNumbers.push(1);
      if (leftSiblingIndex > 2) pageNumbers.push('leftDots');
      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        pageNumbers.push(i);
      }
      if (rightSiblingIndex < totalPages - 1) pageNumbers.push('rightDots');
      pageNumbers.push(totalPages);
    } else if (showLeftDots && !showRightDots) {
      pageNumbers.push(1);
      if (leftSiblingIndex > 2) pageNumbers.push('leftDots');
      for (let i = leftSiblingIndex; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else if (!showLeftDots && showRightDots) {
      for (let i = 1; i <= rightSiblingIndex; i++) {
        pageNumbers.push(i);
      }
      if (rightSiblingIndex < totalPages - 1) pageNumbers.push('rightDots');
      pageNumbers.push(totalPages);
    } else {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn('mx-auto flex w-full justify-center', className)}
      {...restProps}
    >
      <ul className="flex flex-row items-center gap-1">
        <PaginationItem
          variant={variant}
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous Page</span>
        </PaginationItem>

        {getPageNumbers().map((pageNumber, i) => {
          if (pageNumber === 'leftDots' || pageNumber === 'rightDots') {
            return (
              <PaginationItem key={`dots-${i}`} variant={variant} disabled>
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More Pages</span>
              </PaginationItem>
            );
          }

          return (
            <PaginationItem
              key={pageNumber}
              variant={variant}
              isActive={page === pageNumber}
              onClick={() => handlePageChange(pageNumber as number)}
            >
              {pageNumber}
              {page === pageNumber && <span className="sr-only">(current)</span>}
            </PaginationItem>
          );
        })}

        <PaginationItem
          variant={variant}
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next Page</span>
        </PaginationItem>
      </ul>
    </nav>
  );
};

const PaginationItem = ({
  className,
  variant = 'outline',
  isActive,
  children,
  ...props
}: ButtonProps & {
  isActive?: boolean;
  variant?: 'outline' | 'ghost';
}) => {
  return (
    <li>
      <button
        className={cn(
          buttonVariants({
            variant: isActive ? 'default' : variant,
            size: 'icon',
          }),
          className,
        )}
        {...props}
      >
        {children}
      </button>
    </li>
  );
};

export { PaginationV2, PaginationItem };
