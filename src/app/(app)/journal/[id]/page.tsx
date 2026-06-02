import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatTile } from '@/components/ui/StatTile';
import { ALL_SETUPS, TRADE_JOURNAL_ENTRIES } from '@/lib/fixtures';
import {
  CURRENCY_PAIR_LABELS,
  SETUP_MODEL_LABELS,
  SETUP_STATUS_LABELS,
  TRADE_OUTCOME_LABELS,
  formatDateTime,
  formatRMultiple,
  tradeOutcomeTone,
} from '@/lib/display';
import styles from './journal-detail.module.css';

interface RouteProps {
  params: Promise<{ id: string }>;
}

export default async function JournalEntryDetailPage({ params }: RouteProps) {
  const { id } = await params;
  const entry = TRADE_JOURNAL_ENTRIES.find((row) => row.id === id);
  if (!entry) notFound();
  const setup = ALL_SETUPS.find((row) => row.id === entry.setup_id);

  return (
    <>
      <PageHeader
        title={setup ? `${CURRENCY_PAIR_LABELS[setup.pair_code]} ${TRADE_OUTCOME_LABELS[entry.outcome]}` : TRADE_OUTCOME_LABELS[entry.outcome]}
        subtitle={
          setup
            ? `${SETUP_MODEL_LABELS[setup.model]} • Closed ${formatDateTime(entry.closed_at)}`
            : `Closed ${formatDateTime(entry.closed_at)}`
        }
        actions={
          <Link href="/journal" className={styles.linkButton}>
            ← Back to journal
          </Link>
        }
      />

      <div className={styles.statRow}>
        <StatTile
          label="R-multiple"
          value={formatRMultiple(entry.r_multiple)}
          tone={tradeOutcomeTone(entry.outcome)}
        />
        <StatTile label="Pips" value={entry.pips_gained} />
        <StatTile label="Close price" value={entry.close_price} />
        <StatTile
          label="Outcome"
          value={
            <Badge tone={tradeOutcomeTone(entry.outcome)} variant="solid">
              {TRADE_OUTCOME_LABELS[entry.outcome]}
            </Badge>
          }
        />
      </div>

      {setup && (
        <Card>
          <CardHeader title="Originating setup" />
          <dl className={styles.metaGrid}>
            <Meta label="Setup model" value={SETUP_MODEL_LABELS[setup.model]} />
            <Meta label="Direction" value={setup.direction === 'long' ? 'Long' : 'Short'} />
            <Meta label="Entry low" value={setup.entry_zone_low} />
            <Meta label="Entry high" value={setup.entry_zone_high} />
            <Meta label="Stop loss" value={setup.stop_loss_price} />
            <Meta label="Final status" value={SETUP_STATUS_LABELS[setup.status]} />
          </dl>
          <Link href={`/setups/${setup.id}`} className={styles.linkButton}>
            View setup detail →
          </Link>
        </Card>
      )}

      <Card>
        <CardHeader title="Reflection" subtitle="Editable post-close." />
        <form className={styles.reflectionForm}>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Reflection notes</span>
            <textarea
              className={styles.textarea}
              rows={5}
              defaultValue={entry.reflection_notes ?? ''}
              placeholder="What happened? What did you see?"
            />
          </label>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Lessons learned</span>
            <textarea
              className={styles.textarea}
              rows={4}
              defaultValue={entry.lessons_learned ?? ''}
              placeholder="What would you do differently next time?"
            />
          </label>
          <div className={styles.actions}>
            <button type="submit" className="btn-primary">
              Save reflection
            </button>
          </div>
        </form>
      </Card>
    </>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.metaItem}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
