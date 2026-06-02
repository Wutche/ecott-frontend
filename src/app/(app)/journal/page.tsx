import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatTile } from '@/components/ui/StatTile';
import { ALL_SETUPS, PERFORMANCE_STATS, TRADE_JOURNAL_ENTRIES } from '@/lib/fixtures';
import {
  CURRENCY_PAIR_LABELS,
  TRADE_OUTCOME_LABELS,
  formatDate,
  formatPercentage,
  formatRMultiple,
  tradeOutcomeTone,
} from '@/lib/display';
import styles from './journal.module.css';

export default function JournalIndexPage() {
  const setupBySetupId = new Map(ALL_SETUPS.map((setup) => [setup.id, setup]));

  return (
    <>
      <PageHeader
        title="Trade journal"
        subtitle="Closed trades with engine-computed R-multiples and your reflections."
        actions={
          <Link href="/journal/stats" className="btn-primary">
            View performance stats
          </Link>
        }
      />

      <div className={styles.statRow}>
        <StatTile
          label="Total trades"
          value={PERFORMANCE_STATS.total_trades}
          hint={`${PERFORMANCE_STATS.wins}W / ${PERFORMANCE_STATS.losses}L / ${PERFORMANCE_STATS.break_evens}BE`}
        />
        <StatTile
          label="Win rate"
          value={formatPercentage(PERFORMANCE_STATS.win_rate_percentage, 1)}
          tone="success"
        />
        <StatTile
          label="Total R"
          value={formatRMultiple(PERFORMANCE_STATS.total_r_multiple)}
          tone="success"
        />
        <StatTile
          label="Avg R"
          value={formatRMultiple(PERFORMANCE_STATS.average_r_multiple)}
        />
      </div>

      <Card padded={false}>
        <div className={styles.table}>
          <div className={styles.tableHead}>
            <span>Pair</span>
            <span>Outcome</span>
            <span>R-multiple</span>
            <span>Pips</span>
            <span>Closed</span>
            <span></span>
          </div>
          {TRADE_JOURNAL_ENTRIES.map((entry) => {
            const setup = setupBySetupId.get(entry.setup_id);
            return (
              <Link
                key={entry.id}
                href={`/journal/${entry.id}`}
                className={styles.tableRow}
              >
                <span className={styles.pairCode}>
                  {setup ? CURRENCY_PAIR_LABELS[setup.pair_code] : '—'}
                </span>
                <span>
                  <Badge tone={tradeOutcomeTone(entry.outcome)} variant="soft">
                    {TRADE_OUTCOME_LABELS[entry.outcome]}
                  </Badge>
                </span>
                <span
                  className={styles.cellNumeric}
                  style={{
                    color:
                      entry.outcome === 'win'
                        ? 'var(--color-success)'
                        : entry.outcome === 'loss'
                          ? 'var(--color-danger)'
                          : 'var(--color-text-primary)',
                  }}
                >
                  {formatRMultiple(entry.r_multiple)}
                </span>
                <span className={styles.cellNumeric}>{entry.pips_gained}</span>
                <span className={styles.cellMuted}>{formatDate(entry.closed_at)}</span>
                <span className={styles.openIndicator}>→</span>
              </Link>
            );
          })}
        </div>
      </Card>
    </>
  );
}
