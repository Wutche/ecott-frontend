import Link from 'next/link';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { getWatchlists } from '@/lib/api/endpoints';
import { formatDate } from '@/lib/display';
import styles from './watchlists.module.css';

export default async function WatchlistsIndexPage() {
  const watchlists = await getWatchlists();

  return (
    <>
      <PageHeader
        title="Watchlists"
        subtitle="Curated lists of pairs with live COT bias, phase, and your active activity."
        actions={
          <Link href="/watchlists/new" className="btn-primary">
            New watchlist
          </Link>
        }
      />

      {watchlists.length === 0 ? (
        <Card>
          <EmptyState
            title="No watchlists yet"
            description="Create a watchlist to group the pairs you track with live COT bias and phase."
          />
        </Card>
      ) : (
        <div className={styles.grid}>
          {watchlists.map((watchlist) => (
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
                </header>
                <footer className={styles.cardFooter}>
                  <span>Created {formatDate(watchlist.created_at)}</span>
                </footer>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
