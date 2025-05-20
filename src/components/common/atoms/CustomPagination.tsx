import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/paginationV3';

export interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const CustomPagination = ({ currentPage, totalPages, onPageChange }: CustomPaginationProps) => {
  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange}>
      <PaginationContent>
        <PaginationPrevious
          onClick={handlePrevious}
          className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
        />
        {Array.from({ length: totalPages }, (_, i) => (
          <PaginationItem key={i}>
            <PaginationLink isActive={i + 1 === currentPage} onClick={() => onPageChange(i + 1)}>
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationNext
          onClick={handleNext}
          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
        />
      </PaginationContent>
    </Pagination>
  );
};
