import Link from 'next/link';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import {
  ALERT_INBOX,
  CURRENT_USER_PROFILE,
  PRIMARY_WATCHLIST,
  UPCOMING_NEWS_EVENTS,
} from '@/lib/fixtures';
import {
  ALERT_TYPE_LABELS,
  BIAS_DIRECTION_LABELS,
  BIAS_STRENGTH_LABELS,
  CURRENCY_PAIR_LABELS,
  NEWS_IMPACT_LABELS,
  PHASE_LABELS,
  alertSeverityTone,
  biasDirectionTone,
  formatDate,
  formatDateTime,
  formatPercentage,
  formatRelativeTime,
  newsImpactTone,
} from '@/lib/display';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  const unreadAlerts = ALERT_INBOX.filter((alert) => !alert.is_read).slice(0, 4);
  const upcomingHighImpact = UPCOMING_NEWS_EVENTS.filter((event) => event.impact === 'high').slice(0, 4);

  return (
    <>
      <PageHeader
        title={`Welcome back, ${CURRENT_USER_PROFILE.email.split('@')[0]}`}
        subtitle="Live read of the institutional positioning on your tracked pairs."
        actions={
          <Link href="/setups/new" className="btn-primary">
            New setup
          </Link>
        }
      />

      <section className={styles.section}>
        <Card padded={false}>
          <div className={styles.watchlistHeader}>
            <div>
              <h2 className={styles.watchlistTitle}>{PRIMARY_WATCHLIST.name}</h2>
              <p className={styles.watchlistSubtitle}>{PRIMARY_WATCHLIST.description}</p>
            </div>
            <Link href={`/watchlists/${PRIMARY_WATCHLIST.id}`} className={styles.linkButton}>
              Open watchlist →
            </Link>
          </div>

          <div className={styles.watchlistGrid}>
            {PRIMARY_WATCHLIST.items.map((item) => (
              <article key={item.pair_code} className={styles.pairCard}>
                <header className={styles.pairCardHeader}>
                  <span className={styles.pairCode}>{CURRENCY_PAIR_LABELS[item.pair_code]}</span>
                  <Badge tone={biasDirectionTone(item.bias_direction)} variant="solid">
                    {item.bias_strength && item.bias_direction
                      ? `${BIAS_STRENGTH_LABELS[item.bias_strength]} ${BIAS_DIRECTION_LABELS[item.bias_direction]}`
                      : 'Awaiting data'}
                  </Badge>
                </header>

                <dl className={styles.pairMetrics}>
                  <div>
                    <dt>Phase</dt>
                    <dd>
                      {item.phase ? PHASE_LABELS[item.phase] : '—'}
                      {item.phase_confidence_percentage && (
                        <span className={styles.metricHint}>
                          {' '}
                          ({formatPercentage(item.phase_confidence_percentage, 0)})
                        </span>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt>LF COT Index</dt>
                    <dd>
                      {item.leveraged_funds_cot_index_value
                        ? formatPercentage(item.leveraged_funds_cot_index_value, 1)
                        : '—'}
                    </dd>
                  </div>
                  <div>
                    <dt>Active setups</dt>
                    <dd>{item.active_setup_count}</dd>
                  </div>
                  <div>
                    <dt>Liquidity pools</dt>
                    <dd>{item.active_liquidity_pool_count}</dd>
                  </div>
                </dl>

                <footer className={styles.pairFooter}>
                  <span className={styles.pairFooterText}>
                    As of {formatDate(item.latest_report_date)}
                  </span>
                </footer>
              </article>
            ))}
          </div>
        </Card>
      </section>

      <section className={styles.twoColumn}>
        <Card>
          <CardHeader
            title="Recent alerts"
            subtitle="The latest signals across your tracked pairs."
            trailing={
              <Link href="/alerts" className={styles.linkButton}>
                View inbox →
              </Link>
            }
          />
          {unreadAlerts.length === 0 ? (
            <EmptyState
              title="No new alerts"
              description="High-conviction setups and COT phase transitions show up here."
            />
          ) : (
            <ul className={styles.alertList}>
              {unreadAlerts.map((alert) => (
                <li key={alert.id} className={styles.alertRow}>
                  <div className={styles.alertHeader}>
                    <Badge tone={alertSeverityTone(alert.severity)} variant="soft">
                      {ALERT_TYPE_LABELS[alert.alert_type]}
                    </Badge>
                    <span className={styles.alertTime}>{formatRelativeTime(alert.created_at)}</span>
                  </div>
                  <p className={styles.alertTitle}>{alert.title}</p>
                  <p className={styles.alertBody}>{alert.body}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader
            title="Upcoming news risk"
            subtitle="High-impact events to plan around."
            trailing={
              <Link href="/news" className={styles.linkButton}>
                See all →
              </Link>
            }
          />
          {upcomingHighImpact.length === 0 ? (
            <EmptyState
              title="No upcoming high-impact events"
              description="Calendar refreshes daily. Medium and low impact events appear under /news."
            />
          ) : (
            <ul className={styles.newsList}>
              {upcomingHighImpact.map((event) => (
                <li key={event.id} className={styles.newsRow}>
                  <div className={styles.newsLeft}>
                    <span className={styles.newsCurrency}>{event.currency}</span>
                    <div className={styles.newsBody}>
                      <p className={styles.newsName}>{event.name}</p>
                      <p className={styles.newsTime}>{formatDateTime(event.event_at)}</p>
                    </div>
                  </div>
                  <Badge tone={newsImpactTone(event.impact)} variant="outline">
                    {NEWS_IMPACT_LABELS[event.impact]}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>
    </>
  );
}
