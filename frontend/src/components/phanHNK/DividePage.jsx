'use client';
import React from 'react';

export const DividePage = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="mt-10 flex items-center justify-center space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 text-gray-400 hover:text-blue-600 disabled:opacity-30"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      {[...Array(totalPages)].map((_, i) => {
        const pageNumber = i + 1;
        return (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            className={`h-10 w-10 cursor-pointer rounded-lg text-sm font-medium transition-colors ${
              currentPage === pageNumber
                ? 'bg-blue-600 text-white'
                : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
            }`}
          >
            {pageNumber}
          </button>
        );
      })}

      {/* Nút Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 text-gray-400 hover:text-blue-600 disabled:opacity-30"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>
  );
};
