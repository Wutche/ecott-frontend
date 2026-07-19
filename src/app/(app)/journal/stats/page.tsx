import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatTile } from '@/components/ui/StatTile';
import { getJournalStats } from '@/lib/api/endpoints';
import {
  CURRENCY_PAIR_LABELS,
  SETUP_MODEL_LABELS,
  TRADE_OUTCOME_LABELS,
  formatPercentage,
  formatRMultiple,
  tradeOutcomeTone,
} from '@/lib/display';
import type { CurrencyPair, SetupModel } from '@/lib/types';
import styles from './stats.module.css';

export default async function PerformanceStatsPage() {
  const stats = await getJournalStats();
  const streakLabel = stats.current_streak_outcome
    ? `${stats.current_streak_length} × ${TRADE_OUTCOME_LABELS[stats.current_streak_outcome]}`
    : '—';

  return (
    <>
      <PageHeader
        title="Performance stats"
        subtitle="Aggregate view of every closed trade in your journal."
        actions={
          <Link href="/journal" className={styles.linkButton}>
            ← Back to journal
          </Link>
        }
      />

      <div className={styles.statRow}>
        <StatTile label="Total trades" value={stats.total_trades} />
        <StatTile
          label="Win rate"
          value={formatPercentage(stats.win_rate_percentage, 1)}
          tone="success"
        />
        <StatTile
          label="Expectancy"
          value={formatRMultiple(stats.expectancy_r_multiple)}
          hint="Average R per trade"
        />
        <StatTile
          label="Total R"
          value={formatRMultiple(stats.total_r_multiple)}
          tone="success"
        />
        <StatTile
          label="Largest win"
          value={formatRMultiple(stats.largest_win_r_multiple)}
          tone="success"
        />
        <StatTile
          label="Largest loss"
          value={formatRMultiple(stats.largest_loss_r_multiple)}
          tone="danger"
        />
        <StatTile
          label="Current streak"
          value={streakLabel}
          tone={
            stats.current_streak_outcome
              ? tradeOutcomeTone(stats.current_streak_outcome)
              : undefined
          }
        />
        <StatTile
          label="Outcome split"
          value={`${stats.wins}W / ${stats.losses}L / ${stats.break_evens}BE`}
        />
      </div>

      <div className={styles.twoColumn}>
        <Card padded={false}>
          <CardHeader title="By currency pair" />
          <BreakdownTable
            rows={Object.entries(stats.by_pair_code).map(([pairCode, perf]) => ({
              key: pairCode,
              label: CURRENCY_PAIR_LABELS[pairCode as CurrencyPair] ?? pairCode,
              perf,
            }))}
          />
        </Card>

        <Card padded={false}>
          <CardHeader title="By setup model" />
          <BreakdownTable
            rows={Object.entries(stats.by_setup_model).map(([model, perf]) => ({
              key: model,
              label: SETUP_MODEL_LABELS[model as SetupModel] ?? model,
              perf,
            }))}
          />
        </Card>
      </div>
    </>
  );
}

interface BreakdownRow {
  key: string;
  label: string;
  perf: {
    total_trades: number;
    wins: number;
    losses: number;
    break_evens: number;
    win_rate_percentage: string;
    average_r_multiple: string;
  };
}

function BreakdownTable({ rows }: { rows: BreakdownRow[] }) {
  return (
    <div className={styles.breakdown}>
      <div className={styles.breakdownHead}>
        <span></span>
        <span>Trades</span>
        <span>Win rate</span>
        <span>Avg R</span>
      </div>
      {rows.map((row) => {
        const averageR = Number.parseFloat(row.perf.average_r_multiple);
        const averageColor =
          averageR > 0
            ? 'var(--color-success)'
            : averageR < 0
              ? 'var(--color-danger)'
              : 'var(--color-text-primary)';
        return (
          <div key={row.key} className={styles.breakdownRow}>
            <span className={styles.breakdownLabel}>{row.label}</span>
            <span className={styles.cellNumeric}>{row.perf.total_trades}</span>
            <span className={styles.cellNumeric}>
              <Badge tone="info" variant="soft">
                {formatPercentage(row.perf.win_rate_percentage, 0)}
              </Badge>
            </span>
            <span className={styles.cellNumeric} style={{ color: averageColor, fontWeight: 600 }}>
              {formatRMultiple(row.perf.average_r_multiple)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
