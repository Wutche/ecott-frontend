import Link from 'next/link';
import { Card, CardHeader } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import {
  ALL_CURRENCY_PAIRS,
  CURRENCY_PAIR_LABELS,
  LIQUIDITY_POOL_KIND_LABELS,
  LIQUIDITY_POOL_TYPE_LABELS,
  LIQUIDITY_TIMEFRAME_LABELS,
  LIQUIDITY_TIME_AT_LEVEL_LABELS,
} from '@/lib/display';
import type {
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

      <form className={styles.form}>
        <Card>
          <CardHeader title="Identification" />
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
            <Field label="Pool kind">
              <select className={styles.input} defaultValue="buy_side_liquidity">
                {POOL_KINDS.map((kind) => (
                  <option key={kind} value={kind}>
                    {LIQUIDITY_POOL_KIND_LABELS[kind]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Pool type">
              <select className={styles.input} defaultValue="weekly_high_low">
                {POOL_TYPES.map((poolType) => (
                  <option key={poolType} value={poolType}>
                    {LIQUIDITY_POOL_TYPE_LABELS[poolType]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Timeframe">
              <select className={styles.input} defaultValue="weekly">
                {TIMEFRAMES.map((timeframe) => (
                  <option key={timeframe} value={timeframe}>
                    {LIQUIDITY_TIMEFRAME_LABELS[timeframe]}
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
              <input className={styles.input} placeholder="1.16200" />
            </Field>
            <Field label="Zone upper (optional)">
              <input className={styles.input} placeholder="1.16250" />
            </Field>
            <Field label="Zone lower (optional)">
              <input className={styles.input} placeholder="1.16150" />
            </Field>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Validation criteria"
            subtitle="Six-criterion rubric scored against PRD §6.1 weights."
          />
          <div className={styles.fieldGrid}>
            <Field label="Obviousness (1-5)">
              <input
                type="range"
                min={1}
                max={5}
                defaultValue={3}
                className={styles.range}
              />
            </Field>
            <Field label="Time at level">
              <select className={styles.input} defaultValue="few_candles">
                {TIME_AT_LEVEL.map((bucket) => (
                  <option key={bucket} value={bucket}>
                    {LIQUIDITY_TIME_AT_LEVEL_LABELS[bucket]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Visible on N timeframes">
              <input type="number" min={1} max={5} defaultValue={2} className={styles.input} />
            </Field>
          </div>
          <div className={styles.checkboxList}>
            <CheckboxField label="Untested level" />
            <CheckboxField label="Aligned with COT direction" />
          </div>
        </Card>

        <div className={styles.actionsRow}>
          <Link href="/liquidity" className={styles.linkButton}>
            Cancel
          </Link>
          <button type="submit" className="btn-primary">
            Score &amp; create pool
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
