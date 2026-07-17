'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import styles from './sign-in.module.css';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    const supabase = createSupabaseBrowserClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError(signInError.message);
      setSubmitting(false);
      return;
    }
    router.push('/dashboard');
    router.refresh();
  }

  return (
    <Card>
      <div className={styles.header}>
        <h1 className={styles.title}>Sign in</h1>
        <p className={styles.subtitle}>Welcome back. Continue tracking institutional positioning.</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            placeholder="Enter your password"
            autoComplete="current-password"
          />
        </label>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" disabled={submitting} className={`btn-primary ${styles.submit}`}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className={styles.footer}>
        Don&apos;t have an account?{' '}
        <Link href="/sign-up" className={styles.footerLink}>
          Sign up
        </Link>
      </p>
    </Card>
  );
}
