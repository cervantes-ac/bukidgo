import { Loader } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  fullScreen?: boolean;
}

const sizeMap = {
  sm: { icon: 24, padding: '1rem' },
  md: { icon: 40, padding: '2rem' },
  lg: { icon: 56, padding: '3rem' }
};

export function LoadingSpinner({ size = 'md', message, fullScreen = false }: LoadingSpinnerProps) {
  const config = sizeMap[size];

  const content = (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      padding: config.padding
    }}>
      <div style={{
        animation: 'spin 1s linear infinite',
        '@keyframes spin': {
          to: { transform: 'rotate(360deg)' }
        }
      }}>
        <Loader style={{ width: config.icon, height: config.icon, color: '#C4622D' }} />
      </div>
      {message && (
        <p style={{
          fontSize: '14px',
          color: '#1E4D2B',
          fontWeight: 500,
          textAlign: 'center'
        }}>
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(245, 245, 240, 0.95)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999
      }}>
        {content}
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '200px'
    }}>
      {content}
    </div>
  );
}

// CSS animation helper
const spinnerStyles = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export const spinnerStyleSheet = spinnerStyles;
