import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { getLiquidityPools } from '@/lib/api/endpoints';
import {
  CURRENCY_PAIR_LABELS,
  LIQUIDITY_POOL_CLASSIFICATION_LABELS,
  LIQUIDITY_POOL_KIND_LABELS,
  LIQUIDITY_TIMEFRAME_LABELS,
  formatDate,
  formatDecimal,
  liquidityPoolClassificationTone,
} from '@/lib/display';
import styles from './liquidity.module.css';

export default async function LiquidityPoolsIndexPage() {
  const { items: pools } = await getLiquidityPools();

  return (
    <>
      <PageHeader
        title="Liquidity pools"
        subtitle="Mapped pools scored against the six-criterion validation rubric."
        actions={
          <Link href="/liquidity/new" className="btn-primary">
            New pool
          </Link>
        }
      />

      {pools.length === 0 ? (
        <Card>
          <EmptyState
            title="No liquidity pools yet"
            description="Mark your first pool to score it against the six-criterion rubric."
          />
        </Card>
      ) : (
      <Card padded={false}>
        <div className={styles.table}>
          <div className={styles.tableHead}>
            <span>Pair</span>
            <span>Kind</span>
            <span>Timeframe</span>
            <span>Price</span>
            <span>Score</span>
            <span>Tier</span>
            <span>Created</span>
          </div>
          {pools.map((pool) => (
            <Link
              key={pool.id}
              href={`/liquidity/${pool.id}`}
              className={styles.tableRow}
            >
              <span className={styles.pairCode}>{CURRENCY_PAIR_LABELS[pool.pair_code]}</span>
              <span>{LIQUIDITY_POOL_KIND_LABELS[pool.kind]}</span>
              <span className={styles.cellMuted}>
                {LIQUIDITY_TIMEFRAME_LABELS[pool.timeframe]}
              </span>
              <span className={styles.cellNumeric}>{pool.price_level}</span>
              <span className={styles.cellNumeric}>
                {formatDecimal(pool.validation_score, 1)}
              </span>
              <span>
                <Badge tone={liquidityPoolClassificationTone(pool.classification)} variant="soft">
                  {LIQUIDITY_POOL_CLASSIFICATION_LABELS[pool.classification]}
                </Badge>
              </span>
              <span className={styles.cellMuted}>{formatDate(pool.created_at)}</span>
            </Link>
          ))}
        </div>
      </Card>
      )}
    </>
  );
}
