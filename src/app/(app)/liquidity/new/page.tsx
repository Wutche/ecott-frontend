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
  LIQUIDITY_POOL_KIND_LABELS,
  LIQUIDITY_POOL_TYPE_LABELS,
  LIQUIDITY_TIMEFRAME_LABELS,
  LIQUIDITY_TIME_AT_LEVEL_LABELS,
} from '@/lib/display';
import type {
  CurrencyPair,
  LiquidityPool,
  LiquidityPoolKind,
  LiquidityPoolType,
  LiquidityTimeAtLevel,
  LiquidityTimeframe,
} from '@/lib/types';
import styles from './liquidity-new.module.css';

const POOL_KINDS: LiquidityPoolKind[] = [
  'buy_side_liquidity',
  'sell_side_liquidity',
  'fair_value_gap',
  'order_block',
  'breaker_block',
  'liquidity_void',
];

const POOL_TYPES: LiquidityPoolType[] = [
  'monthly_high_low',
  'weekly_high_low',
  'daily_high_low',
  'swing_high_low',
  'equal_high_low',
  'round_number',
  'consolidation',
];

const TIMEFRAMES: LiquidityTimeframe[] = ['monthly', 'weekly', 'daily', 'four_hour', 'one_hour'];

const TIME_AT_LEVEL: LiquidityTimeAtLevel[] = [
  'single_candle',
  'few_candles',
  'multiple_hours',
  'consolidation_zone',
];

export default function NewLiquidityPoolPage() {
  const router = useRouter();
  const [pair, setPair] = useState<CurrencyPair>('EURUSD');
  const [kind, setKind] = useState<LiquidityPoolKind>('buy_side_liquidity');
  const [poolType, setPoolType] = useState<LiquidityPoolType>('weekly_high_low');
  const [timeframe, setTimeframe] = useState<LiquidityTimeframe>('weekly');
  const [priceLevel, setPriceLevel] = useState('');
  const [zoneUpper, setZoneUpper] = useState('');
  const [zoneLower, setZoneLower] = useState('');
  const [obviousness, setObviousness] = useState('3');
  const [timeAtLevel, setTimeAtLevel] = useState<LiquidityTimeAtLevel>('few_candles');
  const [visibility, setVisibility] = useState('2');
  const [isUntested, setIsUntested] = useState(false);
  const [isCotAligned, setIsCotAligned] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const created = await apiFetchClient<LiquidityPool>('/api/liquidity', {
        method: 'POST',
        body: JSON.stringify({
          pair_code: pair,
          kind,
          pool_type: poolType,
          timeframe,
          price_level: priceLevel,
          zone_upper_price: zoneUpper || null,
          zone_lower_price: zoneLower || null,
          obviousness_rating: Number(obviousness),
          is_untested: isUntested,
          time_at_level: timeAtLevel,
          is_cot_direction_aligned: isCotAligned,
          timeframe_visibility_count: Number(visibility),
          notes: null,
        }),
      });
      router.push(`/liquidity/${created.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create the pool.');
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader
        title="New liquidity pool"
        subtitle="Mark a pool and score it against the six-criterion validation rubric."
        actions={
          <Link href="/liquidity" className={styles.linkButton}>
            Cancel
          </Link>
        }
      />

      <form className={styles.form} onSubmit={handleSubmit}>
        <Card>
          <CardHeader title="Identification" />
          <div className={styles.fieldGrid}>
            <Field label="Currency pair">
              <select className={styles.input} value={pair} onChange={(e) => setPair(e.target.value as CurrencyPair)}>
                {ALL_CURRENCY_PAIRS.map((code) => (
                  <option key={code} value={code}>
                    {CURRENCY_PAIR_LABELS[code]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Pool kind">
              <select className={styles.input} value={kind} onChange={(e) => setKind(e.target.value as LiquidityPoolKind)}>
                {POOL_KINDS.map((option) => (
                  <option key={option} value={option}>
                    {LIQUIDITY_POOL_KIND_LABELS[option]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Pool type">
              <select className={styles.input} value={poolType} onChange={(e) => setPoolType(e.target.value as LiquidityPoolType)}>
                {POOL_TYPES.map((option) => (
                  <option key={option} value={option}>
                    {LIQUIDITY_POOL_TYPE_LABELS[option]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Timeframe">
              <select className={styles.input} value={timeframe} onChange={(e) => setTimeframe(e.target.value as LiquidityTimeframe)}>
                {TIMEFRAMES.map((option) => (
                  <option key={option} value={option}>
                    {LIQUIDITY_TIMEFRAME_LABELS[option]}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </Card>

        <Card>
          <CardHeader title="Levels" />
          <div className={styles.fieldGrid}>
            <Field label="Price level">
              <input className={styles.input} value={priceLevel} onChange={(e) => setPriceLevel(e.target.value)} placeholder="1.16200" inputMode="decimal" required />
            </Field>
            <Field label="Zone upper (optional)">
              <input className={styles.input} value={zoneUpper} onChange={(e) => setZoneUpper(e.target.value)} placeholder="1.16250" inputMode="decimal" />
            </Field>
            <Field label="Zone lower (optional)">
              <input className={styles.input} value={zoneLower} onChange={(e) => setZoneLower(e.target.value)} placeholder="1.16150" inputMode="decimal" />
            </Field>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Validation criteria"
            subtitle="Six-criterion rubric scored against PRD §6.1 weights."
          />
          <div className={styles.fieldGrid}>
            <Field label={`Obviousness (${obviousness}/5)`}>
              <input type="range" min={1} max={5} value={obviousness} onChange={(e) => setObviousness(e.target.value)} className={styles.range} />
            </Field>
            <Field label="Time at level">
              <select className={styles.input} value={timeAtLevel} onChange={(e) => setTimeAtLevel(e.target.value as LiquidityTimeAtLevel)}>
                {TIME_AT_LEVEL.map((bucket) => (
                  <option key={bucket} value={bucket}>
                    {LIQUIDITY_TIME_AT_LEVEL_LABELS[bucket]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Visible on N timeframes">
              <input type="number" min={1} max={5} value={visibility} onChange={(e) => setVisibility(e.target.value)} className={styles.input} />
            </Field>
          </div>
          <div className={styles.checkboxList}>
            <label className={styles.checkboxField}>
              <input type="checkbox" className={styles.checkbox} checked={isUntested} onChange={(e) => setIsUntested(e.target.checked)} />
              <span>Untested level</span>
            </label>
            <label className={styles.checkboxField}>
              <input type="checkbox" className={styles.checkbox} checked={isCotAligned} onChange={(e) => setIsCotAligned(e.target.checked)} />
              <span>Aligned with COT direction</span>
            </label>
          </div>
        </Card>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actionsRow}>
          <Link href="/liquidity" className={styles.linkButton}>
            Cancel
          </Link>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Scoring…' : 'Score & create pool'}
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
