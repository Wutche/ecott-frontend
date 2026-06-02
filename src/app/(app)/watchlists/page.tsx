import Link from 'next/link';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ALL_WATCHLISTS } from '@/lib/fixtures';
import {
  BIAS_DIRECTION_LABELS,
  CURRENCY_PAIR_LABELS,
  biasDirectionTone,
  formatDate,
} from '@/lib/display';
import styles from './watchlists.module.css';

export default function WatchlistsIndexPage() {
  return (
    <>
      <PageHeader
        title="Watchlists"
        subtitle="Curated lists of pairs with live COT bias, phase, and your active activity."
        actions={
          <button type="button" className="btn-primary">
            New watchlist
          </button>
        }
      />

      <div className={styles.grid}>
        {ALL_WATCHLISTS.map((watchlist) => (
          <Link
            key={watchlist.id}
            href={`/watchlists/${watchlist.id}`}
            className={styles.cardLink}
          >
            <Card>
              <header className={styles.cardHeader}>
                <div>
                  <h3 className={styles.cardTitle}>{watchlist.name}</h3>
                  {watchlist.description && (
                    <p className={styles.cardSubtitle}>{watchlist.description}</p>
                  )}
                </div>
                <span className={styles.itemCount}>
                  {watchlist.items.length} {watchlist.items.length === 1 ? 'pair' : 'pairs'}
                </span>
              </header>

              <ul className={styles.pairList}>
                {watchlist.items.slice(0, 5).map((item) => (
                  <li key={item.pair_code} className={styles.pairRow}>
                    <span className={styles.pairCode}>
                      {CURRENCY_PAIR_LABELS[item.pair_code]}
                    </span>
                    <Badge tone={biasDirectionTone(item.bias_direction)} variant="soft">
                      {item.bias_direction
                        ? BIAS_DIRECTION_LABELS[item.bias_direction]
                        : 'Awaiting data'}
                    </Badge>
                  </li>
                ))}
              </ul>

              <footer className={styles.cardFooter}>
                <span>Created {formatDate(watchlist.created_at)}</span>
              </footer>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
