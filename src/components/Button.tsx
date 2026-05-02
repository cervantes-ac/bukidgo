import { ReactNode } from 'react';
import { Loader } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

const variantStyles = {
  primary: {
    background: 'linear-gradient(135deg, #C4622D 0%, #9C2A2A 100%)',
    color: '#F5F5F0',
    border: 'none',
    hover: { background: 'linear-gradient(135deg, #9C2A2A 0%, #7A1F1F 100%)' }
  },
  secondary: {
    background: '#0A3D2F',
    color: '#F5F5F0',
    border: 'none',
    hover: { background: '#1E4D2B' }
  },
  outline: {
    background: 'transparent',
    color: '#C4622D',
    border: '2px solid #C4622D',
    hover: { background: '#C4622D', color: '#F5F5F0' }
  },
  ghost: {
    background: 'transparent',
    color: '#C4622D',
    border: 'none',
    hover: { background: 'rgba(196, 98, 45, 0.1)' }
  }
};

const sizeStyles = {
  sm: { padding: '8px 16px', fontSize: '12px', gap: '6px' },
  md: { padding: '12px 24px', fontSize: '14px', gap: '8px' },
  lg: { padding: '16px 32px', fontSize: '16px', gap: '10px' }
};

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  return (
    <button
      disabled={disabled || isLoading}
      style={{
        ...variantStyle,
        ...sizeStyle,
        borderRadius: '4px',
        fontWeight: 600,
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
        opacity: disabled || isLoading ? 0.6 : 1,
        textDecoration: 'none',
        fontFamily: 'inherit',
        letterSpacing: '0.05em',
        textTransform: 'uppercase'
      }}
      onMouseEnter={(e) => {
        if (!disabled && !isLoading) {
          Object.assign(e.currentTarget.style, variantStyle.hover);
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(196, 98, 45, 0.3)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !isLoading) {
          e.currentTarget.style.background = variantStyle.background;
          e.currentTarget.style.color = variantStyle.color;
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
      {...props}
    >
      {isLoading ? (
        <Loader style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />
      ) : icon ? (
        <>
          {icon}
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
}
