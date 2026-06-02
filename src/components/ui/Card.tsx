import type { ReactNode } from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: ReactNode;
  padded?: boolean;
  className?: string;
}

export function Card({ children, padded = true, className }: CardProps) {
  return (
    <div className={`${styles.card} ${padded ? styles.padded : ''} ${className ?? ''}`.trim()}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  trailing?: ReactNode;
}

export function CardHeader({ title, subtitle, trailing }: CardHeaderProps) {
  return (
    <div className={styles.cardHeader}>
      <div className={styles.cardHeaderText}>
        <h3 className={styles.cardTitle}>{title}</h3>
        {subtitle && <p className={styles.cardSubtitle}>{subtitle}</p>}
      </div>
      {trailing && <div className={styles.cardHeaderTrailing}>{trailing}</div>}
    </div>
  );
}
