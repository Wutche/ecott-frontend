import type { ReactNode } from 'react';
import styles from './auth-layout.module.css';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.authShell}>
      <div className={styles.brand}>
        <span className={styles.brandMark} />
        <span className={styles.brandName}>ecott</span>
      </div>
      <div className={styles.content}>{children}</div>
      <footer className={styles.footer}>
        Automated CFTC Commitments of Traders analysis for FX.
      </footer>
    </div>
  );
}
