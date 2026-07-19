import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { getCurrencyMatrix, getDivergences } from '@/lib/api/endpoints';
import {
  DIVERGENCE_TYPE_LABELS,
  FUNDAMENTAL_BIAS_LABELS,
  STATUS_TONE_TO_CSS_VAR,
  divergenceSeverityTone,
  formatDate,
  fundamentalBiasTone,
  fundamentalScoreTone,
} from '@/lib/display';
import styles from './fundamentals.module.css';

export default async function FundamentalsPage() {
  const [{ rankings, best_pair_ideas }, divergences] = await Promise.all([
    getCurrencyMatrix(),
    getDivergences(),
  ]);
  const activeDivergences = divergences.filter((item) => item.resolved_date === null);

  return (
    <>
      <PageHeader
        title="Fundamentals"
        subtitle="Relative currency strength from the weighted macro model, refreshed weekly."
      />

      <section className={styles.section}>
        <Card padded={false}>
          <div className={styles.matrixHead}>
            <span>Rank</span>
            <span>Currency</span>
            <span>Score</span>
            <span>Strength</span>
            <span>Bias</span>
          </div>
          {rankings.map((ranking) => {
            const score = Number(ranking.score);
            return (
              <Link
                key={ranking.currency_code}
                href={`/fundamentals/${ranking.currency_code}`}
                className={styles.matrixRow}
              >
                <span className={styles.rank}>{ranking.rank}</span>
                <span className={styles.currencyCode}>{ranking.currency_code}</span>
                <span className={styles.scoreValue}>{ranking.score}</span>
                <span className={styles.strengthCell}>
                  <span className={styles.strengthTrack}>
                    <span
                      className={styles.strengthFill}
                      style={{
                        width: `${score}%`,
                        backgroundColor: STATUS_TONE_TO_CSS_VAR[fundamentalScoreTone(score)],
                      }}
                    />
                  </span>
                </span>
                <span>
                  <Badge tone={fundamentalBiasTone(ranking.bias)} variant="soft">
                    {FUNDAMENTAL_BIAS_LABELS[ranking.bias]}
                  </Badge>
                </span>
              </Link>
            );
          })}
        </Card>
      </section>

      <section className={styles.twoColumn}>
        <Card>
          <CardHeader
            title="Best pair ideas"
            subtitle="Largest strength gaps — long the stronger, short the weaker."
          />
          {best_pair_ideas.length === 0 ? (
            <EmptyState title="No tradeable gaps" description="Gaps appear once currencies diverge." />
          ) : (
            <ul className={styles.ideaList}>
              {best_pair_ideas.map((idea) => (
                <li key={`${idea.long_currency_code}${idea.short_currency_code}`} className={styles.ideaRow}>
                  <div className={styles.ideaPair}>
                    <span className={styles.ideaLong}>{idea.long_currency_code}</span>
                    <span className={styles.ideaSlash}>/</span>
                    <span className={styles.ideaShort}>{idea.short_currency_code}</span>
                  </div>
                  <span className={styles.ideaGap}>+{idea.score_gap} gap</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader
            title="Active divergences"
            subtitle="Where fundamentals and institutional positioning disagree."
          />
          {activeDivergences.length === 0 ? (
            <EmptyState
              title="No active divergences"
              description="Fundamental-vs-COT conflicts surface here as they form."
            />
          ) : (
            <ul className={styles.divergenceList}>
              {activeDivergences.map((divergence) => (
                <li key={divergence.id} className={styles.divergenceRow}>
                  <div className={styles.divergenceHead}>
                    <Badge tone={divergenceSeverityTone(divergence.severity)} variant="soft">
                      {DIVERGENCE_TYPE_LABELS[divergence.divergence_type]}
                    </Badge>
                    <span className={styles.divergenceMeta}>
                      {divergence.pair_code ?? divergence.asset_code} ·{' '}
                      {formatDate(divergence.detected_date)}
                    </span>
                  </div>
                  <p className={styles.divergenceBody}>{divergence.message}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>
    </>
  );
}
