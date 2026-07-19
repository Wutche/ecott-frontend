import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatTile } from '@/components/ui/StatTile';
import { getLiquidityPool } from '@/lib/api/endpoints';
import {
  CURRENCY_PAIR_LABELS,
  LIQUIDITY_POOL_CLASSIFICATION_LABELS,
  LIQUIDITY_POOL_KIND_LABELS,
  LIQUIDITY_POOL_TYPE_LABELS,
  LIQUIDITY_TIME_AT_LEVEL_LABELS,
  LIQUIDITY_TIMEFRAME_LABELS,
  formatDate,
  formatDecimal,
  liquidityPoolClassificationTone,
} from '@/lib/display';
import styles from './liquidity-detail.module.css';

interface RouteProps {
  params: Promise<{ id: string }>;
}

export default async function LiquidityPoolDetailPage({ params }: RouteProps) {
  const { id } = await params;
  const pool = await getLiquidityPool(id).catch(() => null);
  if (!pool) notFound();

  return (
    <>
      <PageHeader
        title={`${CURRENCY_PAIR_LABELS[pool.pair_code]} ${LIQUIDITY_POOL_KIND_LABELS[pool.kind]}`}
        subtitle={`${LIQUIDITY_POOL_TYPE_LABELS[pool.pool_type]} • Marked ${formatDate(pool.created_at)}`}
        actions={
          <Link href="/liquidity" className={styles.linkButton}>
            ← All pools
          </Link>
        }
      />

      <div className={styles.statRow}>
        <StatTile
          label="Validation score"
          value={formatDecimal(pool.validation_score, 1)}
          tone={liquidityPoolClassificationTone(pool.classification)}
        />
        <StatTile
          label="Tier"
          value={LIQUIDITY_POOL_CLASSIFICATION_LABELS[pool.classification]}
          tone={liquidityPoolClassificationTone(pool.classification)}
        />
        <StatTile label="Price level" value={pool.price_level} />
        <StatTile label="Timeframe" value={LIQUIDITY_TIMEFRAME_LABELS[pool.timeframe]} />
      </div>

      <Card>
        <CardHeader title="Validation breakdown" subtitle="Six criteria with PRD §6.1 weights." />
        <dl className={styles.criteriaGrid}>
          <Criterion
            label="Obviousness rating"
            value={`${pool.obviousness_rating} / 5`}
          />
          <Criterion label="Untested" value={pool.is_untested ? 'Yes' : 'No'} />
          <Criterion
            label="Structural significance"
            value={LIQUIDITY_POOL_TYPE_LABELS[pool.pool_type]}
          />
          <Criterion
            label="Time at level"
            value={LIQUIDITY_TIME_AT_LEVEL_LABELS[pool.time_at_level]}
          />
          <Criterion
            label="COT direction aligned"
            value={pool.is_cot_direction_aligned ? 'Yes' : 'No'}
          />
          <Criterion
            label="Multi-timeframe visibility"
            value={`${pool.timeframe_visibility_count} timeframes`}
          />
        </dl>
        <div className={styles.statusRow}>
          <Badge tone={pool.status === 'active' ? 'success' : 'neutral'} variant="solid">
            {pool.status === 'active' ? 'Active' : pool.status === 'swept' ? 'Swept' : 'Expired'}
          </Badge>
          {pool.notes && <span className={styles.notes}>{pool.notes}</span>}
        </div>
      </Card>
    </>
  );
}

function Criterion({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
