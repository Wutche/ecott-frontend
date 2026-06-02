import Link from 'next/link';
import { Card, CardHeader } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import {
  ALL_CURRENCY_PAIRS,
  CURRENCY_PAIR_LABELS,
  SETUP_MODEL_LABELS,
} from '@/lib/display';
import type { SetupModel } from '@/lib/types';
import styles from './setup-new.module.css';

const SETUP_MODEL_OPTIONS: SetupModel[] = [
  'fibonacci_retracement',
  'structure_break_and_retest',
  'divergence_fade',
];

export default function NewSetupPage() {
  return (
    <>
      <PageHeader
        title="New trade setup"
        subtitle="Score a new setup against the nine-factor confluence rubric and persist the geometry."
        actions={
          <Link href="/setups" className={styles.linkButton}>
            Cancel
          </Link>
        }
      />

      <form className={styles.form}>
        <Card>
          <CardHeader title="Setup identification" />
          <div className={styles.fieldGrid}>
            <Field label="Currency pair">
              <select className={styles.input} defaultValue="EURUSD">
                {ALL_CURRENCY_PAIRS.map((pair) => (
                  <option key={pair} value={pair}>
                    {CURRENCY_PAIR_LABELS[pair]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Setup model">
              <select className={styles.input} defaultValue="fibonacci_retracement">
                {SETUP_MODEL_OPTIONS.map((model) => (
                  <option key={model} value={model}>
                    {SETUP_MODEL_LABELS[model]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Direction">
              <div className={styles.toggleGroup}>
                <button type="button" className={`${styles.toggle} ${styles.toggleActive}`}>
                  ↗ Long
                </button>
                <button type="button" className={styles.toggle}>
                  ↘ Short
                </button>
              </div>
            </Field>
          </div>
        </Card>

        <Card>
          <CardHeader title="Trade geometry" subtitle="Price levels drive the R-multiple math." />
          <div className={styles.fieldGrid}>
            <Field label="Swing high">
              <input className={styles.input} placeholder="1.16200" />
            </Field>
            <Field label="Swing low">
              <input className={styles.input} placeholder="1.13900" />
            </Field>
            <Field label="Entry zone low">
              <input className={styles.input} placeholder="1.14250" />
            </Field>
            <Field label="Entry zone high">
              <input className={styles.input} placeholder="1.14400" />
            </Field>
            <Field label="Stop loss">
              <input className={styles.input} placeholder="1.13852" />
            </Field>
            <Field label="Target 1">
              <input className={styles.input} placeholder="1.15400" />
            </Field>
            <Field label="Target 2 (optional)">
              <input className={styles.input} placeholder="1.16200" />
            </Field>
            <Field label="Target 3 (optional)">
              <input className={styles.input} placeholder="1.17100" />
            </Field>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Manual confluence factors"
            subtitle="Auto factors (COT bias, kill zone, LF extreme) are derived from the latest CFTC report."
          />
          <div className={styles.checkboxList}>
            <CheckboxField label="Divergence present (RSI / MACD)" />
            <CheckboxField label="4H rejection confirmed" />
            <CheckboxField label="Structure + Fib double confluence" />
            <CheckboxField label="Dealer stop-hunt wick visible" />
          </div>
        </Card>

        <Card>
          <CardHeader title="Notes" />
          <textarea
            className={styles.textarea}
            placeholder="Optional notes on the thesis or chart context."
            rows={4}
          />
        </Card>

        <div className={styles.actionsRow}>
          <Link href="/setups" className={styles.linkButton}>
            Cancel
          </Link>
          <button type="submit" className="btn-primary">
            Score &amp; create setup
          </button>
        </div>
      </form>
    </>
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

function CheckboxField({ label }: { label: string }) {
  return (
    <label className={styles.checkboxField}>
      <input type="checkbox" className={styles.checkbox} />
      <span>{label}</span>
    </label>
  );
}
