import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  totalItems?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '2rem',
      borderTop: '1px solid #E8DCC8'
    }}>
      <div style={{
        fontSize: '13px',
        color: '#1E4D2B'
      }}>
        {totalItems && itemsPerPage && (
          <>
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
          </>
        )}
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            border: '1px solid #E8DCC8',
            background: '#F5F5F0',
            borderRadius: '4px',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            opacity: currentPage === 1 ? 0.5 : 1,
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            if (currentPage > 1) {
              e.currentTarget.style.background = '#C4622D';
              e.currentTarget.style.color = '#F5F5F0';
              e.currentTarget.style.borderColor = '#C4622D';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#F5F5F0';
            e.currentTarget.style.color = 'inherit';
            e.currentTarget.style.borderColor = '#E8DCC8';
          }}
          aria-label="Previous page"
        >
          <ChevronLeft style={{ width: 16, height: 16 }} />
        </button>

        {getPageNumbers().map((page, idx) => (
          <button
            key={idx}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
            style={{
              width: '32px',
              height: '32px',
              border: page === currentPage ? '1px solid #C4622D' : '1px solid #E8DCC8',
              background: page === currentPage ? '#C4622D' : '#F5F5F0',
              color: page === currentPage ? '#F5F5F0' : '#0A3D2F',
              borderRadius: '4px',
              cursor: page === '...' ? 'default' : 'pointer',
              fontWeight: page === currentPage ? 700 : 500,
              fontSize: '13px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (page !== '...' && page !== currentPage) {
                e.currentTarget.style.background = '#E8DCC8';
              }
            }}
            onMouseLeave={(e) => {
              if (page !== '...' && page !== currentPage) {
                e.currentTarget.style.background = '#F5F5F0';
              }
            }}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            border: '1px solid #E8DCC8',
            background: '#F5F5F0',
            borderRadius: '4px',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            opacity: currentPage === totalPages ? 0.5 : 1,
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            if (currentPage < totalPages) {
              e.currentTarget.style.background = '#C4622D';
              e.currentTarget.style.color = '#F5F5F0';
              e.currentTarget.style.borderColor = '#C4622D';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#F5F5F0';
            e.currentTarget.style.color = 'inherit';
            e.currentTarget.style.borderColor = '#E8DCC8';
          }}
          aria-label="Next page"
        >
          <ChevronRight style={{ width: 16, height: 16 }} />
        </button>
      </div>
    </div>
  );
}
