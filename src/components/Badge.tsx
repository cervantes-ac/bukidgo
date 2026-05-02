import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  icon?: ReactNode;
}

const variantStyles = {
  primary: { background: '#C4622D', color: '#F5F5F0' },
  success: { background: '#4CAF50', color: '#F5F5F0' },
  warning: { background: '#FF9800', color: '#F5F5F0' },
  error: { background: '#F44336', color: '#F5F5F0' },
  info: { background: '#2196F3', color: '#F5F5F0' }
};

const sizeStyles = {
  sm: { padding: '4px 8px', fontSize: '11px' },
  md: { padding: '6px 12px', fontSize: '12px' }
};

export function Badge({
  children,
  variant = 'primary',
  size = 'md',
  icon
}: BadgeProps) {
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  return (
    <span style={{
      ...variantStyle,
      ...sizeStyle,
      borderRadius: '4px',
      fontWeight: 600,
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      whiteSpace: 'nowrap',
      letterSpacing: '0.05em',
      textTransform: 'uppercase'
    }}>
      {icon}
      {children}
    </span>
  );
}
