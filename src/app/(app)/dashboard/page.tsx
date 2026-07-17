import Link from 'next/link';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import {
  getAlerts,
  getCurrencyMatrix,
  getDivergences,
  getRiskSentiment,
  getUserProfile,
  getWatchlist,
  getWatchlists,
} from '@/lib/api/endpoints';
import {
  ALERT_TYPE_LABELS,
  BIAS_DIRECTION_LABELS,
  BIAS_STRENGTH_LABELS,
  CURRENCY_PAIR_LABELS,
  DIVERGENCE_TYPE_LABELS,
  PHASE_LABELS,
  RISK_REGIME_LABELS,
  STATUS_TONE_TO_CSS_VAR,
  alertSeverityTone,
  biasDirectionTone,
  divergenceSeverityTone,
  formatDate,
  formatPercentage,
  formatRelativeTime,
  riskRegimeTone,
} from '@/lib/display';
import styles from './dashboard.module.css';

export default async function DashboardPage() {
  const [profile, riskSentiment, watchlists, alerts, divergences, matrix] = await Promise.all([
    getUserProfile(),
    getRiskSentiment(),
    getWatchlists(),
    getAlerts(),
    getDivergences(),
    getCurrencyMatrix(),
  ]);
  const primaryWatchlist = watchlists[0] ? await getWatchlist(watchlists[0].id) : null;

  const unreadAlerts = alerts.filter((alert) => !alert.is_read).slice(0, 4);
  const topOpportunities = matrix.best_pair_ideas.slice(0, 3);
  const activeDivergences = divergences.filter((item) => item.resolved_date === null);

  return (
    <>
      <PageHeader
        title={`Welcome back, ${profile.email.split('@')[0]}`}
        subtitle="Live read of the institutional positioning on your tracked pairs."
        actions={
          <Link href="/setups/new" className="btn-primary">
            New setup
          </Link>
        }
      />

      {riskSentiment && (
        <section className={styles.section}>
          <Link href="/markets" className={styles.riskBanner}>
            <div className={styles.riskBannerHead}>
              <span className={styles.riskBannerLabel}>Risk Sentiment Composite</span>
              <Badge tone={riskRegimeTone(riskSentiment.regime)} variant="soft">
                {RISK_REGIME_LABELS[riskSentiment.regime]}
              </Badge>
            </div>
            <div className={styles.riskBannerBody}>
              <span className={styles.riskBannerScore}>{riskSentiment.score}</span>
              <span className={styles.riskBannerTrack}>
                <span
                  className={styles.riskBannerFill}
                  style={{
                    width: `${Number(riskSentiment.score)}%`,
                    backgroundColor:
                      STATUS_TONE_TO_CSS_VAR[riskRegimeTone(riskSentiment.regime)],
                  }}
                />
              </span>
              <span className={styles.riskBannerLink}>Open markets →</span>
            </div>
          </Link>
        </section>
      )}

      <section className={styles.section}>
        <Card padded={false}>
          <div className={styles.watchlistHeader}>
            <div>
              <h2 className={styles.watchlistTitle}>
                {primaryWatchlist?.name ?? 'Your watchlist'}
              </h2>
              <p className={styles.watchlistSubtitle}>
                {primaryWatchlist?.description ?? 'Track institutional positioning on your pairs.'}
              </p>
            </div>
            <Link href="/watchlists" className={styles.linkButton}>
              {primaryWatchlist ? 'Open watchlist →' : 'Manage watchlists →'}
            </Link>
          </div>

          {!primaryWatchlist || primaryWatchlist.items.length === 0 ? (
            <div style={{ padding: '0 1.5rem 1.5rem' }}>
              <EmptyState
                title="No pairs tracked yet"
                description="Create a watchlist and add pairs to see their COT bias, phase and setups here."
              />
            </div>
          ) : (
            <div className={styles.watchlistGrid}>
              {primaryWatchlist.items.map((item) => (
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
                      {item.latest_report_date
                        ? `As of ${formatDate(item.latest_report_date)}`
                        : 'Awaiting first report'}
                    </span>
                  </footer>
                </article>
              ))}
            </div>
          )}
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
            title="Fundamental divergences"
            subtitle="Where institutions and fundamentals disagree."
            trailing={
              <Link href="/fundamentals" className={styles.linkButton}>
                Open fundamentals →
              </Link>
            }
          />
          {activeDivergences.length === 0 ? (
            <EmptyState
              title="No active divergences"
              description="Fundamental-vs-COT conflicts surface here as they form."
            />
          ) : (
            <>
              <ul className={styles.alertList}>
                {activeDivergences.map((divergence) => (
                  <li key={divergence.id} className={styles.alertRow}>
                    <div className={styles.alertHeader}>
                      <Badge tone={divergenceSeverityTone(divergence.severity)} variant="soft">
                        {DIVERGENCE_TYPE_LABELS[divergence.divergence_type]}
                      </Badge>
                      <span className={styles.alertTime}>
                        {divergence.pair_code
                          ? CURRENCY_PAIR_LABELS[divergence.pair_code]
                          : divergence.asset_code}
                      </span>
                    </div>
                    <p className={styles.alertBody}>{divergence.message}</p>
                  </li>
                ))}
              </ul>
              {topOpportunities.length > 0 && (
                <div className={styles.opportunityRow}>
                  <span className={styles.opportunityLabel}>Top fundamental pairs</span>
                  <div className={styles.opportunityChips}>
                    {topOpportunities.map((idea) => (
                      <span
                        key={`${idea.long_currency_code}${idea.short_currency_code}`}
                        className={styles.opportunityChip}
                      >
                        {idea.long_currency_code}/{idea.short_currency_code}
                        <span className={styles.opportunityGap}>+{idea.score_gap}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </Card>
      </section>
    </>
  );
}
