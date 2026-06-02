import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { UPCOMING_NEWS_EVENTS } from '@/lib/fixtures';
import {
  NEWS_IMPACT_LABELS,
  formatDateTime,
  newsImpactTone,
} from '@/lib/display';
import styles from './news.module.css';

export default function NewsRiskPage() {
  const sortedEvents = [...UPCOMING_NEWS_EVENTS].sort((a, b) =>
    a.event_at.localeCompare(b.event_at),
  );

  return (
    <>
      <PageHeader
        title="News risk"
        subtitle="Upcoming high-impact forex calendar events that gate setup creation."
        actions={
          <select className={styles.windowSelect} defaultValue="24">
            <option value="24">Next 24h</option>
            <option value="168">Next 7 days</option>
          </select>
        }
      />

      {sortedEvents.length === 0 ? (
        <EmptyState
          title="No upcoming events"
          description="The forex calendar refreshes hourly. Lower-impact events show under a separate tab."
        />
      ) : (
        <Card padded={false}>
          <ul className={styles.eventList}>
            {sortedEvents.map((event) => (
              <li key={event.id} className={styles.eventRow}>
                <div className={styles.eventLeft}>
                  <span className={styles.currencyChip}>{event.currency}</span>
                  <div>
                    <p className={styles.eventName}>{event.name}</p>
                    {event.description && (
                      <p className={styles.eventDescription}>{event.description}</p>
                    )}
                  </div>
                </div>
                <div className={styles.eventRight}>
                  <Badge tone={newsImpactTone(event.impact)} variant="outline">
                    {NEWS_IMPACT_LABELS[event.impact]}
                  </Badge>
                  <span className={styles.eventTime}>{formatDateTime(event.event_at)}</span>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}
