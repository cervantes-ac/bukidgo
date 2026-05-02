interface SkeletonLoaderProps {
  count?: number;
  type?: 'card' | 'row' | 'text';
  height?: string;
}

export function SkeletonLoader({ count = 3, type = 'card', height = '200px' }: SkeletonLoaderProps) {
  const skeletons = Array.from({ length: count });

  const baseStyle = {
    background: 'linear-gradient(90deg, #E8DCC8 25%, #F5F0E8 50%, #E8DCC8 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 2s infinite',
    borderRadius: '4px'
  };

  if (type === 'card') {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1rem'
      }}>
        {skeletons.map((_, i) => (
          <div key={i} style={{
            borderRadius: '4px',
            overflow: 'hidden',
            border: '1px solid #E8DCC8'
          }}>
            <div style={{ ...baseStyle, height: height }} />
            <div style={{ padding: '1rem' }}>
              <div style={{ ...baseStyle, height: '20px', marginBottom: '0.5rem' }} />
              <div style={{ ...baseStyle, height: '16px', width: '80%' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'row') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {skeletons.map((_, i) => (
          <div key={i} style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto auto auto',
            gap: '1rem',
            padding: '1rem',
            borderBottom: '1px solid #E8DCC8'
          }}>
            <div style={{ ...baseStyle, height: '40px' }} />
            <div style={{ ...baseStyle, height: '40px', width: '100px' }} />
            <div style={{ ...baseStyle, height: '40px', width: '100px' }} />
            <div style={{ ...baseStyle, height: '40px', width: '100px' }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {skeletons.map((_, i) => (
        <div key={i} style={{ ...baseStyle, height: '16px' }} />
      ))}
    </div>
  );
}

// CSS animation
export const skeletonStyles = `
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;
