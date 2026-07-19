import Link from 'next/link';
import { Card, CardHeader } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { getWeeklyStory } from '@/lib/api/endpoints';
import { CURRENCY_PAIR_LABELS, formatDate } from '@/lib/display';
import type { CurrencyPair, WeeklyStory } from '@/lib/types';
import styles from './story-detail.module.css';

interface RouteProps {
  params: Promise<{ pair: string; week: string }>;
}

const CHAPTERS: Array<{ key: keyof WeeklyStory; title: string; editable: boolean }> = [
  { key: 'chapter_0_text', title: 'Chapter 0 — Fundamental backdrop', editable: false },
  { key: 'chapter_1_text', title: 'Chapter 1 — COT context', editable: false },
  { key: 'chapter_2_text', title: 'Chapter 2 — Multi-timeframe structure', editable: true },
  { key: 'chapter_3_text', title: 'Chapter 3 — Liquidity targets', editable: true },
  { key: 'chapter_4_text', title: 'Chapter 4 — Execution plan', editable: true },
  { key: 'chapter_5_text', title: 'Chapter 5 — Post-trade review', editable: true },
];

export default async function StoryDetailPage({ params }: RouteProps) {
  const { pair, week } = await params;
  const pairLabel = CURRENCY_PAIR_LABELS[pair as CurrencyPair] ?? pair;
  const story = await getWeeklyStory(pair, week);

  return (
    <>
      <PageHeader
        title={`${pairLabel} — ${formatDate(week)}`}
        subtitle="Chapters 0–1 are auto-generated each Friday. Chapters 2–5 are yours to author."
        actions={
          <Link href="/story" className={styles.linkButton}>
            ← All stories
          </Link>
        }
      />

      <div className={styles.chapters}>
        {CHAPTERS.map((chapter) => {
          const content = story?.[chapter.key];
          return (
            <Card key={chapter.key}>
              <CardHeader
                title={chapter.title}
                subtitle={chapter.editable ? 'User-editable' : 'Auto-generated'}
              />
              {chapter.editable ? (
                <textarea
                  className={styles.editor}
                  rows={6}
                  defaultValue={typeof content === 'string' ? content : ''}
                  placeholder="Write this chapter..."
                />
              ) : (
                <p className={styles.staticText}>
                  {typeof content === 'string' ? content : 'Awaiting CFTC ingestion.'}
                </p>
              )}
            </Card>
          );
        })}
      </div>

      <div className={styles.actionsRow}>
        <button type="submit" className="btn-primary">
          Save story
        </button>
      </div>
    </>
  );
}
