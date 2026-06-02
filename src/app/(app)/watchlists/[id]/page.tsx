import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { ALL_WATCHLISTS } from '@/lib/fixtures';
import {
  BIAS_DIRECTION_LABELS,
  BIAS_STRENGTH_LABELS,
  CURRENCY_PAIR_LABELS,
  PHASE_CONFIDENCE_LABELS,
  PHASE_LABELS,
  biasDirectionTone,
  formatDate,
  formatPercentage,
} from '@/lib/display';
import styles from './watchlist-detail.module.css';

interface RouteProps {
  params: Promise<{ id: string }>;
}

export default async function WatchlistDetailPage({ params }: RouteProps) {
  const { id } = await params;
  const watchlist = ALL_WATCHLISTS.find((entry) => entry.id === id);
  if (!watchlist) notFound();

  return (
    <>
      <PageHeader
        title={watchlist.name}
        subtitle={watchlist.description ?? undefined}
        actions={
          <>
            <Link href="/watchlists" className={styles.linkButton}>
              ← All watchlists
            </Link>
            <button type="button" className={styles.outlineButton}>
              Edit pairs
            </button>
          </>
        }
      />

      <Card padded={false}>
        <CardHeader title={`${watchlist.items.length} tracked pairs`} />

        <div className={styles.table}>
          <div className={styles.tableHead}>
            <span>Pair</span>
            <span>Bias</span>
            <span>Phase</span>
            <span>LF Index</span>
            <span>Active setups</span>
            <span>Liquidity pools</span>
            <span>As of</span>
          </div>

          {watchlist.items.map((item) => (
            <div key={item.pair_code} className={styles.tableRow}>
              <span className={styles.pairCode}>
                {CURRENCY_PAIR_LABELS[item.pair_code]}
              </span>
              <span>
                <Badge tone={biasDirectionTone(item.bias_direction)} variant="soft">
                  {item.bias_strength && item.bias_direction
                    ? `${BIAS_STRENGTH_LABELS[item.bias_strength]} ${BIAS_DIRECTION_LABELS[item.bias_direction]}`
                    : 'Awaiting data'}
                </Badge>
              </span>
              <span className={styles.cellMixed}>
                <strong>{item.phase ? PHASE_LABELS[item.phase] : '—'}</strong>
                {item.phase_confidence && (
                  <span className={styles.cellHint}>
                    {PHASE_CONFIDENCE_LABELS[item.phase_confidence]}
                  </span>
                )}
              </span>
              <span className={styles.cellNumeric}>
                {item.leveraged_funds_cot_index_value
                  ? formatPercentage(item.leveraged_funds_cot_index_value, 1)
                  : '—'}
              </span>
              <span className={styles.cellNumeric}>{item.active_setup_count}</span>
              <span className={styles.cellNumeric}>{item.active_liquidity_pool_count}</span>
              <span className={styles.cellMuted}>
                {formatDate(item.latest_report_date)}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <section className={styles.statementsSection}>
        <h2 className={styles.sectionTitle}>Bias statements</h2>
        <div className={styles.statementList}>
          {watchlist.items.map((item) => (
            <Card key={item.pair_code}>
              <header className={styles.statementHeader}>
                <span className={styles.pairCode}>
                  {CURRENCY_PAIR_LABELS[item.pair_code]}
                </span>
                <Badge tone={biasDirectionTone(item.bias_direction)} variant="solid">
                  {item.bias_strength && item.bias_direction
                    ? `${BIAS_STRENGTH_LABELS[item.bias_strength]} ${BIAS_DIRECTION_LABELS[item.bias_direction]}`
                    : 'Awaiting data'}
                </Badge>
              </header>
              <p className={styles.statementBody}>
                {item.bias_statement_text ?? 'Bias statement available after the first CFTC ingestion.'}
              </p>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
