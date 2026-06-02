import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import styles from './sign-in.module.css';

export default function SignInPage() {
  return (
    <Card>
      <div className={styles.header}>
        <h1 className={styles.title}>Sign in</h1>
        <p className={styles.subtitle}>Welcome back. Continue tracking institutional positioning.</p>
      </div>

      <form className={styles.form}>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Email</span>
          <input
            type="email"
            className={styles.input}
            placeholder="trader@example.com"
            autoComplete="email"
          />
        </label>
        <label className={styles.field}>
          <div className={styles.fieldLabelRow}>
            <span className={styles.fieldLabel}>Password</span>
            <Link href="/sign-in" className={styles.forgotLink}>
              Forgot?
            </Link>
          </div>
          <input
            type="password"
            className={styles.input}
            placeholder="Enter your password"
            autoComplete="current-password"
          />
        </label>

        <Link href="/dashboard" className={`btn-primary ${styles.submit}`}>
          Sign in
        </Link>
      </form>

      <div className={styles.divider}>
        <span>or</span>
      </div>

      <button type="button" className={styles.providerButton}>
        Continue with Google
      </button>

      <p className={styles.footer}>
        Don&apos;t have an account?{' '}
        <Link href="/sign-up" className={styles.footerLink}>
          Sign up
        </Link>
      </p>
    </Card>
  );
}
