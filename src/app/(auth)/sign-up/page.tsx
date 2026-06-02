import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import styles from './sign-up.module.css';

export default function SignUpPage() {
  return (
    <Card>
      <div className={styles.header}>
        <h1 className={styles.title}>Create your account</h1>
        <p className={styles.subtitle}>
          Start tracking institutional COT positioning across the eight majors.
        </p>
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
          <span className={styles.fieldLabel}>Password</span>
          <input
            type="password"
            className={styles.input}
            placeholder="Choose a strong password"
            autoComplete="new-password"
          />
          <span className={styles.helpText}>
            At least 8 characters with one number and one symbol.
          </span>
        </label>

        <Link href="/onboarding" className={`btn-primary ${styles.submit}`}>
          Create account
        </Link>
      </form>

      <p className={styles.footer}>
        Already have an account?{' '}
        <Link href="/sign-in" className={styles.footerLink}>
          Sign in
        </Link>
      </p>
    </Card>
  );
}
