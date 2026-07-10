import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatTile } from '@/components/ui/StatTile';
import { FUNDAMENTAL_SCORES, USD_TREND } from '@/lib/fixtures';
import {
  FUNDAMENTAL_BIAS_LABELS,
  FUNDAMENTAL_COMPONENT_LABELS,
  FUNDAMENTAL_PHASE_LABELS,
  FUNDAMENTAL_TREND_LABELS,
  STATUS_TONE_TO_CSS_VAR,
  formatDate,
  fundamentalBiasTone,
  fundamentalScoreTone,
  fundamentalTrendTone,
} from '@/lib/display';
import styles from './fundamental-detail.module.css';

interface RouteProps {
  params: Promise<{ currency: string }>;
}

export default async function FundamentalDetailPage({ params }: RouteProps) {
  const { currency } = await params;
  const score = FUNDAMENTAL_SCORES[currency.toUpperCase()];
  if (!score) notFound();

  const trend = USD_TREND.asset_code === score.asset_code ? USD_TREND : null;

  return (
    <>
      <PageHeader
        title={`${score.asset_code} fundamentals`}
        subtitle={`Weighted macro score as of ${formatDate(score.score_date)}.`}
        actions={
          <Link href="/fundamentals" className={styles.linkButton}>
            ← Strength matrix
          </Link>
        }
      />

      <div className={styles.statRow}>
        <StatTile
          label="Total score"
          value={score.total_score}
          tone={fundamentalScoreTone(Number(score.total_score))}
        />
        <StatTile
          label="Bias"
          value={FUNDAMENTAL_BIAS_LABELS[score.bias]}
          tone={fundamentalBiasTone(score.bias)}
        />
        <StatTile
          label="Phase"
          value={score.phase ? FUNDAMENTAL_PHASE_LABELS[score.phase] : '—'}
        />
        {trend && (
          <StatTile
            label="Trend"
            value={FUNDAMENTAL_TREND_LABELS[trend.direction]}
            tone={fundamentalTrendTone(trend.direction)}
          />
        )}
      </div>

      <Card>
        <CardHeader
          title="Component breakdown"
          subtitle="Each driver normalised 0–100, then weighted into the total."
        />
        <ul className={styles.componentList}>
          {score.component_scores.map((component) => {
            const value = Number(component.score);
            return (
              <li key={component.component} className={styles.componentRow}>
                <div className={styles.componentLabel}>
                  <span className={styles.componentName}>
                    {FUNDAMENTAL_COMPONENT_LABELS[component.component] ?? component.component}
                  </span>
                  <span className={styles.componentWeight}>
                    weight {Math.round(Number(component.weight) * 100)}%
                  </span>
                </div>
                <div className={styles.componentTrack}>
                  <span
                    className={styles.componentFill}
                    style={{
                      width: `${value}%`,
                      backgroundColor: STATUS_TONE_TO_CSS_VAR[fundamentalScoreTone(value)],
                    }}
                  />
                </div>
                <span className={styles.componentValue}>{component.score}</span>
              </li>
            );
          })}
        </ul>
      </Card>

      {trend && (
        <Card>
          <CardHeader title="Momentum" subtitle="Score change across trailing windows." />
          <div className={styles.trendGrid}>
            <TrendCell label="4-week" value={trend.change_4_week} />
            <TrendCell label="12-week" value={trend.change_12_week} />
            <TrendCell label="26-week" value={trend.change_26_week} />
            <div className={styles.trendCell}>
              <span className={styles.trendLabel}>Direction</span>
              <Badge tone={fundamentalTrendTone(trend.direction)} variant="soft">
                {FUNDAMENTAL_TREND_LABELS[trend.direction]}
              </Badge>
              <span className={styles.trendHint}>{trend.consecutive_weeks} weeks running</span>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}

function TrendCell({ label, value }: { label: string; value: string | null }) {
  const numeric = value === null ? null : Number(value);
  const sign = numeric !== null && numeric > 0 ? '+' : '';
  const tone = numeric === null ? '' : numeric > 0 ? styles.trendUp : numeric < 0 ? styles.trendDown : '';
  return (
    <div className={styles.trendCell}>
      <span className={styles.trendLabel}>{label}</span>
      <span className={`${styles.trendValue} ${tone}`}>
        {numeric === null ? '—' : `${sign}${value}`}
      </span>
    </div>
  );
}
