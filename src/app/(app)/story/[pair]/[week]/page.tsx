import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { getWeeklyStory } from '@/lib/api/endpoints';
import { CURRENCY_PAIR_LABELS, formatDate } from '@/lib/display';
import type { CurrencyPair } from '@/lib/types';
import { StoryEditor } from './StoryEditor';
import styles from './story-detail.module.css';

interface RouteProps {
  params: Promise<{ pair: string; week: string }>;
}

export default async function StoryDetailPage({ params }: RouteProps) {
  const { pair, week } = await params;
  const pairLabel = CURRENCY_PAIR_LABELS[pair as CurrencyPair] ?? pair;
  const story = await getWeeklyStory(pair, week);

  return (
    <>
      <PageHeader
        title={`${pairLabel} — ${formatDate(week)}`}
        subtitle="Chapter 1 is auto-generated each Friday. Chapters 2–5 are yours to author."
        actions={
          <Link href="/story" className={styles.linkButton}>
            ← All stories
          </Link>
        }
      />

      {story ? (
        <StoryEditor pair={pair} week={week} story={story} />
      ) : (
        <Card>
          <EmptyState
            title="No story for this week yet"
            description="Chapter 1 is written from the weekly CFTC report. Once that report is ingested for this pair, the story appears here and you can author chapters 2–5."
          />
        </Card>
      )}
    </>
  );
}
