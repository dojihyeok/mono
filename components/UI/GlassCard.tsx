import React from 'react';
import styles from './GlassCard.module.css';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export default function GlassCard({
  children,
  className = '',
  onClick,
  hoverEffect = false,
}: GlassCardProps) {
  return (
    <div
      className={`${styles.glassCard} ${hoverEffect ? styles.hoverable : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
