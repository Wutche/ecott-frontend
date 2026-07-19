import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { getWatchlist, getWatchlists } from '@/lib/api/endpoints';
import { CURRENCY_PAIR_LABELS, formatDate } from '@/lib/display';
import styles from './story.module.css';

export default async function StoryIndexPage() {
  const watchlists = await getWatchlists();
  const primary = watchlists[0] ? await getWatchlist(watchlists[0].id) : null;
  const items = (primary?.items ?? []).filter((item) => item.latest_report_date);

  return (
    <>
      <PageHeader
        title="Weekly story"
        subtitle="Six-chapter narrative per pair, generated from each weekly COT report."
      />

      {items.length === 0 ? (
        <Card>
          <EmptyState
            title="No stories yet"
            description="Stories are written from the weekly CFTC report. Add pairs to a watchlist — each one's story appears here after the next report is ingested."
          />
        </Card>
      ) : (
        <div className={styles.grid}>
          {items.map((item) => (
            <Link
              key={item.pair_code}
              href={`/story/${item.pair_code}/${item.latest_report_date}`}
              className={styles.cardLink}
            >
              <Card>
                <header className={styles.cardHeader}>
                  <span className={styles.pairCode}>{CURRENCY_PAIR_LABELS[item.pair_code]}</span>
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
      )}
    </>
  );
}
