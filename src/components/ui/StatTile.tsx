import type { ReactNode } from 'react';
import { STATUS_TONE_TO_CSS_VAR, type StatusTone } from '@/lib/display';
import styles from './StatTile.module.css';

interface StatTileProps {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: StatusTone;
}

export function StatTile({ label, value, hint, tone }: StatTileProps) {
  const accentColor = tone ? STATUS_TONE_TO_CSS_VAR[tone] : 'var(--color-text-primary)';
  return (
    <div className={styles.tile}>
      <span className={styles.label}>{label}</span>
      <strong className={styles.value} style={{ color: accentColor }}>
        {value}
      </strong>
      {hint && <span className={styles.hint}>{hint}</span>}
    </div>
  );
}
