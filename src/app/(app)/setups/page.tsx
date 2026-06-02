import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { ACTIVE_SETUPS } from '@/lib/fixtures';
import {
  CURRENCY_PAIR_LABELS,
  SETUP_CLASSIFICATION_LABELS,
  SETUP_MODEL_LABELS,
  SETUP_STATUS_LABELS,
  formatDate,
  formatDecimal,
  setupClassificationTone,
} from '@/lib/display';
import styles from './setups.module.css';

export default function SetupsIndexPage() {
  return (
    <>
      <PageHeader
        title="Setups"
        subtitle="Active and recent trade setups scored against the nine-factor confluence rubric."
        actions={
          <Link href="/setups/new" className="btn-primary">
            New setup
          </Link>
        }
      />

      <Card padded={false}>
        <div className={styles.table}>
          <div className={styles.tableHead}>
            <span>Pair</span>
            <span>Model</span>
            <span>Direction</span>
            <span>Score</span>
            <span>Classification</span>
            <span>Status</span>
            <span>Created</span>
          </div>

          {ACTIVE_SETUPS.map((setup) => (
            <Link key={setup.id} href={`/setups/${setup.id}`} className={styles.tableRow}>
              <span className={styles.pairCode}>{CURRENCY_PAIR_LABELS[setup.pair_code]}</span>
              <span>{SETUP_MODEL_LABELS[setup.model]}</span>
              <span className={styles.direction}>
                <span className={setup.direction === 'long' ? styles.long : styles.short}>
                  {setup.direction === 'long' ? '↗' : '↘'}
                </span>{' '}
                {setup.direction === 'long' ? 'Long' : 'Short'}
              </span>
              <span className={styles.cellNumeric}>{formatDecimal(setup.confluence_score, 1)}</span>
              <span>
                <Badge
                  tone={setupClassificationTone(setup.confluence_classification)}
                  variant="soft"
                >
                  {SETUP_CLASSIFICATION_LABELS[setup.confluence_classification]}
                </Badge>
              </span>
              <span className={styles.cellMuted}>{SETUP_STATUS_LABELS[setup.status]}</span>
              <span className={styles.cellMuted}>{formatDate(setup.created_at)}</span>
            </Link>
          ))}
        </div>
      </Card>
    </>
  );
}
