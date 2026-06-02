import type { ReactNode } from 'react';
import { STATUS_TONE_TO_CSS_VAR, type StatusTone } from '@/lib/display';
import styles from './Badge.module.css';

interface BadgeProps {
  tone?: StatusTone;
  variant?: 'solid' | 'soft' | 'outline';
  children: ReactNode;
}

export function Badge({ tone = 'neutral', variant = 'soft', children }: BadgeProps) {
  const accent = STATUS_TONE_TO_CSS_VAR[tone];
  if (variant === 'solid') {
    return (
      <span
        className={styles.badge}
        style={{ backgroundColor: accent, color: '#fff', borderColor: accent }}
      >
        {children}
      </span>
    );
  }
  if (variant === 'outline') {
    return (
      <span className={styles.badge} style={{ color: accent, borderColor: accent }}>
        {children}
      </span>
    );
  }
  return (
    <span
      className={styles.badge}
      style={{ color: accent, borderColor: accent, backgroundColor: 'transparent' }}
    >
      {children}
    </span>
  );
}
