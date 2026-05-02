import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  action?: ReactNode;
  background?: string;
}

export function PageHeader({
  title,
  subtitle,
  description,
  action,
  background = 'linear-gradient(135deg, #0A3D2F 0%, #1E4D2B 100%)'
}: PageHeaderProps) {
  return (
    <div style={{
      background,
      color: '#F5F5F0',
      padding: '3rem 2rem',
      borderBottom: '1px solid rgba(196, 98, 45, 0.2)'
    }}>
      <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '2rem',
          flexWrap: 'wrap'
        }}>
          <div>
            {subtitle && (
              <p style={{
                fontSize: '12px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(245, 245, 240, 0.7)',
                marginBottom: '0.5rem',
                fontWeight: 600
              }}>
                {subtitle}
              </p>
            )}
            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 900,
              margin: 0,
              marginBottom: description ? '0.5rem' : 0,
              lineHeight: 1.1
            }}>
              {title}
            </h1>
            {description && (
              <p style={{
                fontSize: '16px',
                color: 'rgba(245, 245, 240, 0.8)',
                maxWidth: '500px',
                lineHeight: 1.6,
                margin: 0,
                marginTop: '0.5rem'
              }}>
                {description}
              </p>
            )}
          </div>
          {action && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {action}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
