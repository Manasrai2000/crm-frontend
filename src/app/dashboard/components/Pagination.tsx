'use client';
import { useState } from 'react';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ totalPages, currentPage, onPageChange }: PaginationProps) {
  const [jumpPage, setJumpPage] = useState<string>('');

  const handleJump = () => {
    const page = parseInt(jumpPage);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      onPageChange(page);
      setJumpPage('');
    }
  };

  const getPages = (): (number | string)[] => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  return (
    <nav className="flex items-center justify-center mt-4 flex-wrap gap-2">
      <ul className="flex space-x-1 mb-0 mr-2">
        <li>
          <button
            className={`px-2 py-1 text-sm rounded hover:bg-gray-200 ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'}`}
            onClick={() => onPageChange(1)}
            aria-label="First"
            disabled={currentPage === 1}
          >
            &laquo;
          </button>
        </li>
        <li>
          <button
            className={`px-2 py-1 text-sm rounded hover:bg-gray-200 ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'}`}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Previous"
            disabled={currentPage === 1}
          >
            &lsaquo;
          </button>
        </li>
        {getPages().map((pg, idx) => (
          <li key={idx}>
            {pg === '...' ? (
              <span className="px-2 py-1 text-sm rounded text-gray-500">...</span>
            ) : (
              <button
                className={`
                  px-2 py-1 text-sm rounded transition-all
                  ${pg === currentPage
                    ? 'bg-blue-600 text-white font-bold'
                    : 'hover:bg-gray-200 text-gray-700'}
                `}
                onClick={() => onPageChange(pg as number)}
                aria-current={pg === currentPage ? "page" : undefined}
              >
                {pg}
              </button>
            )}
          </li>
        ))}
        <li>
          <button
            className={`px-2 py-1 text-sm rounded hover:bg-gray-200 ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'}`}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Next"
            disabled={currentPage === totalPages}
          >
            &rsaquo;
          </button>
        </li>
        <li>
          <button
            className={`px-2 py-1 text-sm rounded hover:bg-gray-200 ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'}`}
            onClick={() => onPageChange(totalPages)}
            aria-label="Last"
            disabled={currentPage === totalPages}
          >
            &raquo;
          </button>
        </li>
      </ul>

      <div className="flex items-center space-x-2 w-40">
        <input
          type="number"
          className="border border-gray-300 rounded-md p-1 text-sm w-20 focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Go to page"
          value={jumpPage}
          min={1}
          max={totalPages}
          onChange={(e) => setJumpPage(e.target.value)}
        />
        <button
          className="px-3 py-1 bg-white border border-blue-600 text-blue-600 rounded hover:bg-blue-50 text-sm"
          onClick={handleJump}
        >
          Go
        </button>
      </div>
    </nav>
  );
}
