import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface CardProps {
  children: ReactNode;
  hoverable?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export function Card({
  children,
  hoverable = false,
  onClick,
  className,
  style
}: CardProps) {
  const baseStyle: React.CSSProperties = {
    background: '#F5F5F0',
    border: '1px solid #E8DCC8',
    borderRadius: '8px',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
    cursor: hoverable ? 'pointer' : 'default',
    ...style
  };

  if (hoverable) {
    return (
      <motion.div
        whileHover={{ y: -8 }}
        onClick={onClick}
        style={baseStyle}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div style={baseStyle} className={className}>
      {children}
    </div>
  );
}
