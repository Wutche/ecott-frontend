import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { ALL_CURRENCY_PAIRS, CURRENCY_PAIR_LABELS } from '@/lib/display';
import styles from './onboarding.module.css';

export default function OnboardingPage() {
  return (
    <Card>
      <div className={styles.header}>
        <span className={styles.stepLabel}>Step 1 of 1</span>
        <h1 className={styles.title}>Set up your trading profile</h1>
        <p className={styles.subtitle}>
          Used by the position-size calculator and to tailor alerts. You can change all of this later in settings.
        </p>
      </div>

      <form className={styles.form}>
        <div className={styles.fieldGrid}>
          <Field label="Experience level">
            <select className={styles.input} defaultValue="intermediate">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </Field>
          <Field label="Timezone">
            <select className={styles.input} defaultValue="America/New_York">
              <option>America/New_York</option>
              <option>Europe/London</option>
              <option>Asia/Tokyo</option>
              <option>Australia/Sydney</option>
            </select>
          </Field>
          <Field label="Account balance (USD)">
            <input className={styles.input} placeholder="10000.00" />
          </Field>
          <Field label="Default risk % per trade">
            <input className={styles.input} placeholder="0.01" />
            <span className={styles.helpText}>PRD §5.4 bounds: 0.5% — 2.0%.</span>
          </Field>
          <Field label="Primary trading pair">
            <select className={styles.input} defaultValue="EURUSD">
              {ALL_CURRENCY_PAIRS.map((pair) => (
                <option key={pair} value={pair}>
                  {CURRENCY_PAIR_LABELS[pair]}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className={styles.preferredPairsSection}>
          <span className={styles.fieldLabel}>Preferred pairs to track</span>
          <div className={styles.pairChips}>
            {ALL_CURRENCY_PAIRS.map((pair) => (
              <label key={pair} className={styles.pairChip}>
                <input type="checkbox" className={styles.checkbox} defaultChecked />
                <span>{CURRENCY_PAIR_LABELS[pair]}</span>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.actionsRow}>
          <Link href="/dashboard" className={`btn-primary ${styles.submit}`}>
            Continue to dashboard
          </Link>
        </div>
      </form>
    </Card>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      {children}
    </label>
  );
}
