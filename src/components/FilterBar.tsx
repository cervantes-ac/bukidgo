import { Search, X } from 'lucide-react';
import { ReactNode } from 'react';

interface FilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onReset?: () => void;
  hasActiveFilters?: boolean;
  children?: ReactNode;
  placeholder?: string;
}

export function FilterBar({
  searchValue,
  onSearchChange,
  onReset,
  hasActiveFilters = false,
  children,
  placeholder = 'Search...'
}: FilterBarProps) {
  return (
    <div style={{
      position: 'sticky',
      top: 0,
      zIndex: 20,
      background: 'rgba(245, 245, 240, 0.96)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid #E8DCC8',
      padding: '1rem 2rem'
    }}>
      <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: children ? '1rem' : 0
        }}>
          {/* Search Input */}
          <div style={{
            flex: 1,
            minWidth: '200px',
            maxWidth: '400px',
            position: 'relative'
          }}>
            <Search style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: 16,
              height: 16,
              color: '#8B6F47'
            }} />
            <input
              type="text"
              placeholder={placeholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '36px',
                paddingRight: '12px',
                paddingTop: '10px',
                paddingBottom: '10px',
                background: '#fff',
                border: '1px solid #E8DCC8',
                borderRadius: '4px',
                fontSize: '13px',
                color: '#0A3D2F',
                outline: 'none',
                transition: 'border-color 0.2s',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#C4622D';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#E8DCC8';
              }}
              aria-label="Search"
            />
          </div>

          {/* Reset Button */}
          {hasActiveFilters && onReset && (
            <button
              onClick={onReset}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#C4622D',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '8px 12px',
                borderRadius: '4px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(196, 98, 45, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
              aria-label="Reset filters"
            >
              <X style={{ width: 14, height: 14 }} />
              Reset
            </button>
          )}
        </div>

        {/* Additional Filters */}
        {children && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
