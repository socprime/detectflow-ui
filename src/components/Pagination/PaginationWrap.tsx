import { useMemo } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './Pagination';

interface PaginationWrapProps {
  page: number;
  totalPages: number;
  maxVisible?: number;
  onPageChange: (page: number) => void;
}

export const PaginationWrap: React.FC<PaginationWrapProps> = ({
  page,
  totalPages,
  onPageChange,
  maxVisible = 5,
}) => {
  const pageNumbers = useMemo(() => {
    const pages: number[] = [];

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push(-1);
        pages.push(totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1);
        pages.push(-1);
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push(-1);
        for (let i = page - 1; i <= page + 1; i++) {
          pages.push(i);
        }
        pages.push(-1);
        pages.push(totalPages);
      }
    }

    return pages;
  }, [page, totalPages, maxVisible]);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(Math.max(1, page - 1))}
            className={`h-8 text-xs ${page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
          />
        </PaginationItem>
        {pageNumbers.map((pageNum, idx) => (
          <PaginationItem key={idx}>
            {pageNum === -1 ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                className={`h-8 w-8 cursor-pointer text-xs ${page === pageNum ? 'border-border' : ''}`}
                onClick={() => onPageChange(pageNum)}
                isActive={page === pageNum}
              >
                {pageNum}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            className={`h-8 text-xs ${page === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
