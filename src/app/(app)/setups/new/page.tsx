'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { apiFetchClient } from '@/lib/apiClient';
import {
  ALL_CURRENCY_PAIRS,
  CURRENCY_PAIR_LABELS,
  SETUP_MODEL_LABELS,
} from '@/lib/display';
import type { CurrencyPair, SetupDirection, SetupModel, UserSetup } from '@/lib/types';
import styles from './setup-new.module.css';

const SETUP_MODEL_OPTIONS: SetupModel[] = [
  'fibonacci_retracement',
  'structure_break_and_retest',
  'divergence_fade',
];

const FACTOR_KEYS = [
  { key: 'divergence_present', label: 'Divergence present (RSI / MACD)' },
  { key: 'four_hour_rejection_confirmed', label: '4H rejection confirmed' },
  { key: 'structure_fib_double_confluence', label: 'Structure + Fib double confluence' },
  { key: 'dealer_stop_hunt_wick_visible', label: 'Dealer stop-hunt wick visible' },
] as const;

export default function NewSetupPage() {
  const router = useRouter();
  const [pair, setPair] = useState<CurrencyPair>('EURUSD');
  const [model, setModel] = useState<SetupModel>('fibonacci_retracement');
  const [direction, setDirection] = useState<SetupDirection>('long');
  const [geometry, setGeometry] = useState<Record<string, string>>({
    swing_high: '',
    swing_low: '',
    entry_zone_low: '',
    entry_zone_high: '',
    stop_loss_price: '',
    target_1_price: '',
    target_2_price: '',
    target_3_price: '',
  });
  const [factors, setFactors] = useState<Record<string, boolean>>({
    divergence_present: false,
    four_hour_rejection_confirmed: false,
    structure_fib_double_confluence: false,
    dealer_stop_hunt_wick_visible: false,
  });
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setField(key: string, value: string) {
    setGeometry((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const created = await apiFetchClient<UserSetup>('/api/setup', {
        method: 'POST',
        body: JSON.stringify({
          pair_code: pair,
          model,
          direction,
          swing_high: geometry.swing_high,
          swing_low: geometry.swing_low,
          entry_zone_low: geometry.entry_zone_low,
          entry_zone_high: geometry.entry_zone_high,
          stop_loss_price: geometry.stop_loss_price,
          target_1_price: geometry.target_1_price,
          target_2_price: geometry.target_2_price || null,
          target_3_price: geometry.target_3_price || null,
          manual_factors: factors,
          notes: notes || null,
        }),
      });
      router.push(`/setups/${created.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create the setup.');
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader
        title="New trade setup"
        subtitle="Score a new setup against the confluence rubric and persist the geometry."
        actions={
          <Link href="/setups" className={styles.linkButton}>
            Cancel
          </Link>
        }
      />

      <form className={styles.form} onSubmit={handleSubmit}>
        <Card>
          <CardHeader title="Setup identification" />
          <div className={styles.fieldGrid}>
            <Field label="Currency pair">
              <select
                className={styles.input}
                value={pair}
                onChange={(e) => setPair(e.target.value as CurrencyPair)}
              >
                {ALL_CURRENCY_PAIRS.map((code) => (
                  <option key={code} value={code}>
                    {CURRENCY_PAIR_LABELS[code]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Setup model">
              <select
                className={styles.input}
                value={model}
                onChange={(e) => setModel(e.target.value as SetupModel)}
              >
                {SETUP_MODEL_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {SETUP_MODEL_LABELS[option]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Direction">
              <div className={styles.toggleGroup}>
                <button
                  type="button"
                  className={`${styles.toggle} ${direction === 'long' ? styles.toggleActive : ''}`}
                  onClick={() => setDirection('long')}
                >
                  ↗ Long
                </button>
                <button
                  type="button"
                  className={`${styles.toggle} ${direction === 'short' ? styles.toggleActive : ''}`}
                  onClick={() => setDirection('short')}
                >
                  ↘ Short
                </button>
              </div>
            </Field>
          </div>
        </Card>

        <Card>
          <CardHeader title="Trade geometry" subtitle="Price levels drive the R-multiple math." />
          <div className={styles.fieldGrid}>
            {[
              ['swing_high', 'Swing high', '1.16200'],
              ['swing_low', 'Swing low', '1.13900'],
              ['entry_zone_low', 'Entry zone low', '1.14250'],
              ['entry_zone_high', 'Entry zone high', '1.14400'],
              ['stop_loss_price', 'Stop loss', '1.13852'],
              ['target_1_price', 'Target 1', '1.15400'],
              ['target_2_price', 'Target 2 (optional)', '1.16200'],
              ['target_3_price', 'Target 3 (optional)', '1.17100'],
            ].map(([key, label, placeholder]) => (
              <Field key={key} label={label}>
                <input
                  className={styles.input}
                  value={geometry[key]}
                  onChange={(e) => setField(key, e.target.value)}
                  placeholder={placeholder}
                  inputMode="decimal"
                  required={key !== 'target_2_price' && key !== 'target_3_price'}
                />
              </Field>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Manual confluence factors"
            subtitle="Auto factors (COT bias, kill zone, LF extreme) are derived from the latest CFTC report."
          />
          <div className={styles.checkboxList}>
            {FACTOR_KEYS.map(({ key, label }) => (
              <label key={key} className={styles.checkboxField}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={factors[key]}
                  onChange={(e) => setFactors((prev) => ({ ...prev, [key]: e.target.checked }))}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Notes" />
          <textarea
            className={styles.textarea}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional notes on the thesis or chart context."
            rows={4}
          />
        </Card>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actionsRow}>
          <Link href="/setups" className={styles.linkButton}>
            Cancel
          </Link>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Scoring…' : 'Score & create setup'}
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
