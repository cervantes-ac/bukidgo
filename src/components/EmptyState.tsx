import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action
}: EmptyStateProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 2rem',
      textAlign: 'center',
      minHeight: '300px'
    }}>
      {Icon && (
        <Icon style={{
          width: 56,
          height: 56,
          color: '#E8DCC8',
          marginBottom: '1rem'
        }} />
      )}
      <h3 style={{
        fontSize: '1.5rem',
        fontWeight: 700,
        color: '#E8DCC8',
        marginBottom: '0.5rem'
      }}>
        {title}
      </h3>
      {description && (
        <p style={{
          fontSize: '14px',
          color: '#B8B0A4',
          maxWidth: '400px',
          marginBottom: action ? '1.5rem' : 0
        }}>
          {description}
        </p>
      )}
      {action && (
        <div>
          {action}
        </div>
      )}
    </div>
  );
}
