'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import styles from './sign-up.module.css';

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    const supabase = createSupabaseBrowserClient();
    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) {
      setError(signUpError.message);
      setSubmitting(false);
      return;
    }
    // When email confirmation is enabled, no session is returned yet.
    if (data.session) {
      router.push('/onboarding');
      router.refresh();
    } else {
      setCheckEmail(true);
      setSubmitting(false);
    }
  }

  if (checkEmail) {
    return (
      <Card>
        <div className={styles.header}>
          <h1 className={styles.title}>Check your email</h1>
          <p className={styles.subtitle}>
            We sent a confirmation link to <strong>{email}</strong>. Confirm it, then sign in.
          </p>
        </div>
        <Link href="/sign-in" className={`btn-primary ${styles.submit}`}>
          Go to sign in
        </Link>
      </Card>
    );
  }

  return (
    <Card>
      <div className={styles.header}>
        <h1 className={styles.title}>Create your account</h1>
        <p className={styles.subtitle}>
          Start tracking institutional COT positioning across the eight majors.
        </p>
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
          <span className={styles.fieldLabel}>Password</span>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            placeholder="Choose a strong password"
            autoComplete="new-password"
          />
          <span className={styles.helpText}>At least 8 characters.</span>
        </label>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" disabled={submitting} className={`btn-primary ${styles.submit}`}>
          {submitting ? 'Creating account…' : 'Create account'}
        </button>
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
