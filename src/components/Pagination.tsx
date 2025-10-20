/** @format */
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  total: number;
  limit: number;
  onPageChange: (newPage: number) => void;
}

export default function Pagination({
  page,
  total,
  limit,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(total / limit) || 1;
  const currentPage = page + 1;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex justify-between items-center mt-4">
      <div className="text-sm text-base-content/60">
        Result <strong>{page * limit + 1}</strong>-
        <strong>{Math.min((page + 1) * limit, total)}</strong> of{' '}
        <strong>{total}</strong>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="btn btn-outline btn-sm flex items-center gap-1"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}>
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <div className="flex gap-1">
          {getPageNumbers().map((pageNum, idx) => {
            if (pageNum === '...') {
              return (
                <button
                  key={`ellipsis-${idx}`}
                  className="btn btn-sm btn-ghost pointer-events-none"
                  disabled>
                  ...
                </button>
              );
            }

            const pageIndex = pageNum as number;
            const isActive = pageIndex === currentPage;

            return (
              <button
                key={pageIndex}
                onClick={() => onPageChange(pageIndex - 1)}
                className={`btn btn-sm ${
                  isActive
                    ? 'btn-primary'
                    : 'btn-ghost hover:btn-primary hover:btn-outline'
                }`}>
                {pageIndex}
              </button>
            );
          })}
        </div>

        <button
          className="btn btn-outline btn-sm flex items-center gap-1"
          onClick={() => onPageChange(page + 1)}
          disabled={currentPage >= totalPages}>
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
