import { useMemo, useState } from 'react';
import { Button } from '../Button';
import { Input, SelectDefault } from '../Form';
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
  limit?: number;
  setLimit?: (limit: number) => void;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
}

const perPageOptions = [
  { label: '10', value: '10' },
  { label: '25', value: '25' },
  { label: '50', value: '50' },
  { label: '100', value: '100' },
];

export const PaginationWrap: React.FC<PaginationWrapProps> = ({
  page,
  totalPages,
  limit = 25,
  maxVisible = 5,
  onPageChange,
  setLimit = () => {},
}) => {
  const [pageGo, setPageGo] = useState<number | null>(null);
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

  const onPageGoClick = () => {
    onPageChange(Number(pageGo));
    setPageGo(null);
  };

  const limitItemChange = (value: string) => {
    setLimit(Number(value));
    setPageGo(null);
  };

  const previousPageClick = () => {
    onPageChange(Math.max(1, page - 1));
    setPageGo(null);
  };

  const nextPageClick = () => {
    onPageChange(Math.min(totalPages, page + 1));
    setPageGo(null);
  };

  const pageClick = (page: number) => {
    onPageChange(page);
    setPageGo(null);
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <div className="text-gray-chateau hidden text-xs whitespace-nowrap lg:flex">
          Items per page:
        </div>
        <SelectDefault
          className="h-8 text-xs"
          options={perPageOptions}
          value={limit.toString()}
          placeholder="Select items per page"
          onChange={limitItemChange}
        />
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={previousPageClick}
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
                  onClick={() => pageClick(pageNum)}
                  isActive={page === pageNum}
                >
                  {pageNum}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={nextPageClick}
              className={`h-8 text-xs ${page === totalPages || totalPages === 0 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <div className="flex items-center gap-2">
        <div className="text-gray-chateau hidden text-xs whitespace-nowrap lg:flex">Go to:</div>
        <Input
          className="h-8 w-13 px-2 text-xs"
          type="text"
          value={pageGo ?? ''}
          placeholder="Page"
          pattern="^[0-9]*$"
          onChange={(e) => setPageGo(Number(e.target.value) || null)}
        />
        <Button
          className="px-2 text-xs"
          size="s"
          variant="secondary"
          disabled={pageGo !== null ? !(pageGo > 0 && pageGo <= totalPages) : true}
          onClick={onPageGoClick}
        >
          Go
        </Button>
      </div>
    </div>
  );
};
