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
  return (
    <div className="flex justify-between items-center mt-4">
      <button
        className="btn btn-outline btn-sm flex items-center gap-1"
        onClick={() => onPageChange(Math.max(page - 1, 0))}
        disabled={page === 0}>
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>

      <span className="text-sm text-gray-500">
        Page <strong>{page + 1}</strong> of{' '}
        <strong>{Math.ceil(total / limit) || 1}</strong>
      </span>

      <button
        className="btn btn-outline btn-sm flex items-center gap-1"
        onClick={() => onPageChange(page + 1)}
        disabled={(page + 1) * limit >= total}>
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
