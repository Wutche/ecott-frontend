import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardHeader } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatTile } from '@/components/ui/StatTile';
import { getSetup } from '@/lib/api/endpoints';
import { CloseSetupButton } from './CloseSetupButton';
import {
  CONFLUENCE_FACTOR_LABELS,
  CURRENCY_PAIR_LABELS,
  SETUP_CLASSIFICATION_LABELS,
  SETUP_MODEL_LABELS,
  SETUP_STATUS_LABELS,
  formatDate,
  formatDecimal,
  setupClassificationTone,
} from '@/lib/display';
import styles from './setup-detail.module.css';

interface RouteProps {
  params: Promise<{ id: string }>;
}

export default async function SetupDetailPage({ params }: RouteProps) {
  const { id } = await params;
  const setup = await getSetup(id).catch(() => null);
  if (!setup) notFound();

  const isActive = setup.status === 'active';
  const factorPointsAwarded = setup.confluence_factors.filter((factor) => factor.passed).length;

  return (
    <>
      <PageHeader
        title={`${CURRENCY_PAIR_LABELS[setup.pair_code]} ${setup.direction === 'long' ? 'Long' : 'Short'}`}
        subtitle={`${SETUP_MODEL_LABELS[setup.model]} • Activated ${formatDate(setup.activated_at)}`}
        actions={
          <>
            <Link href="/setups" className={styles.linkButton}>
              ← All setups
            </Link>
            {isActive && <CloseSetupButton setupId={setup.id} />}
          </>
        }
      />

      <div className={styles.statRow}>
        <StatTile
          label="Confluence score"
          value={formatDecimal(setup.confluence_score, 1)}
          hint={`${factorPointsAwarded} of 9 factors passing`}
          tone={setupClassificationTone(setup.confluence_classification)}
        />
        <StatTile
          label="Classification"
          value={SETUP_CLASSIFICATION_LABELS[setup.confluence_classification]}
          tone={setupClassificationTone(setup.confluence_classification)}
        />
        <StatTile label="Status" value={SETUP_STATUS_LABELS[setup.status]} />
        <StatTile label="COT report" value={formatDate(setup.cot_report_date)} />
      </div>

      <div className={styles.twoColumn}>
        <Card>
          <CardHeader title="Confluence breakdown" subtitle="PRD §5.3 nine-factor rubric." />
          <ul className={styles.factorList}>
            {setup.confluence_factors.map((factor) => (
              <li key={factor.name} className={styles.factorRow}>
                <div className={styles.factorLeft}>
                  <span
                    className={`${styles.factorMarker} ${factor.passed ? styles.factorPass : styles.factorFail}`}
                    aria-hidden="true"
                  >
                    {factor.passed ? '✓' : '·'}
                  </span>
                  <span className={styles.factorName}>
                    {CONFLUENCE_FACTOR_LABELS[factor.name] ?? factor.name}
                  </span>
                </div>
                <span className={styles.factorPoints}>
                  {factor.passed ? `+${formatDecimal(factor.points_awarded, 1)}` : '—'}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader title="Trade geometry" />
          <dl className={styles.geometryGrid}>
            <Geometry label="Swing high" value={setup.swing_high} />
            <Geometry label="Swing low" value={setup.swing_low} />
            <Geometry label="Entry low" value={setup.entry_zone_low} />
            <Geometry label="Entry high" value={setup.entry_zone_high} />
            <Geometry label="Stop loss" value={setup.stop_loss_price} tone="danger" />
            <Geometry label="Target 1" value={setup.target_1_price} tone="success" />
            <Geometry label="Target 2" value={setup.target_2_price} tone="success" />
            <Geometry label="Target 3" value={setup.target_3_price} tone="success" />
          </dl>

          {setup.notes && (
            <div className={styles.notes}>
              <span className={styles.notesLabel}>Notes</span>
              <p>{setup.notes}</p>
            </div>
          )}
        </Card>
      </div>

      {!isActive && (
        <Card>
          <CardHeader title="Trade outcome" />
          <p className={styles.outcomePlaceholder}>
            Detailed journal entry, R-multiple, and reflection live on the journal page.
          </p>
          <Link href={`/journal/${setup.id}`} className={styles.linkButton}>
            View journal entry →
          </Link>
        </Card>
      )}
    </>
  );
}

function Geometry({
  label,
  value,
  tone,
}: {
  label: string;
  value: string | null;
  tone?: 'success' | 'danger';
}) {
  const accentColor =
    tone === 'success'
      ? 'var(--color-success)'
      : tone === 'danger'
        ? 'var(--color-danger)'
        : 'var(--color-text-primary)';
  return (
    <div className={styles.geometryItem}>
      <dt>{label}</dt>
      <dd style={{ color: value ? accentColor : 'var(--color-text-muted)' }}>
        {value ?? '—'}
      </dd>
    </div>
  );
}
