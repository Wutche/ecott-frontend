import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { CURRENT_WEEK_STORY, PRIMARY_WATCHLIST } from '@/lib/fixtures';
import { CURRENCY_PAIR_LABELS, formatDate } from '@/lib/display';
import styles from './story.module.css';

export default function StoryIndexPage() {
  const reportDate = CURRENT_WEEK_STORY.report_date;

  return (
    <>
      <PageHeader
        title="Weekly story"
        subtitle={`Five-chapter narrative per pair. Latest report: ${formatDate(reportDate)}.`}
      />

      <div className={styles.grid}>
        {PRIMARY_WATCHLIST.items.map((item) => (
          <Link
            key={item.pair_code}
            href={`/story/${item.pair_code}/${reportDate}`}
            className={styles.cardLink}
          >
            <Card>
              <header className={styles.cardHeader}>
                <span className={styles.pairCode}>
                  {CURRENCY_PAIR_LABELS[item.pair_code]}
                </span>
                <span className={styles.weekLabel}>
                  Week of {formatDate(item.latest_report_date)}
                </span>
              </header>
              <p className={styles.snippet}>
                {item.bias_statement_text ?? 'Awaiting first CFTC ingestion.'}
              </p>
              <footer className={styles.cardFooter}>
                <span>Open story →</span>
              </footer>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
